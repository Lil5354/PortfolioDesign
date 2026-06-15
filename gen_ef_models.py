import re
import os

prisma_type_to_cs_type = {
    'String': 'string',
    'String?': 'string?',
    'Int': 'int',
    'Int?': 'int?',
    'Boolean': 'bool',
    'Boolean?': 'bool?',
    'DateTime': 'DateTime',
    'DateTime?': 'DateTime?',
    'Decimal': 'decimal',
    'Decimal?': 'decimal?',
    'Json': 'string',
    'Json?': 'string?',
    'String[]': 'List<string>',
}

# Add enum types
enum_types = ['Role', 'ReactionType', 'NotificationType', 'DisplayOrder', 'ReportStatus']
for e in enum_types:
    prisma_type_to_cs_type[e] = e
    prisma_type_to_cs_type[e + '?'] = f"{e}?"

def parse_prisma(schema_path):
    with open(schema_path, 'r', encoding='utf-8') as f:
        content = f.read()

    models = {}
    enums = {}

    # parse enums
    enum_matches = re.finditer(r'enum\s+(\w+)\s*\{([\s\S]*?)\}', content)
    for match in enum_matches:
        enum_name = match.group(1)
        enum_body = match.group(2)
        values = [v.strip() for v in enum_body.split('\n') if v.strip() and not v.strip().startswith('//')]
        enums[enum_name] = values

    # parse models
    model_matches = re.finditer(r'model\s+(\w+)\s*\{([\s\S]*?)\}', content)
    for match in model_matches:
        model_name = match.group(1)
        model_body = match.group(2)
        
        fields = []
        for line in model_body.split('\n'):
            line = line.strip()
            if not line or line.startswith('//') or line.startswith('@@'):
                continue
                
            parts = [p for p in line.split(' ') if p]
            if len(parts) >= 2:
                field_name = parts[0]
                field_type = parts[1]
                
                # Check if it's a relationship
                is_relation = False
                is_list_relation = False
                if field_type.startswith(model_name) or field_type.endswith('[]') and field_type[:-2] not in prisma_type_to_cs_type and field_type[:-2] != 'String':
                    pass # We'll handle relations manually or skip them in basic generation

                cs_type = prisma_type_to_cs_type.get(field_type, field_type)
                
                # Handling relations
                if '@relation' in line:
                    if field_type.endswith('[]'):
                        cs_type = f"ICollection<{field_type[:-2]}>"
                        is_list_relation = True
                    else:
                        cs_type = field_type.replace('?', '') + ('?' if field_type.endswith('?') else '')
                        is_relation = True
                elif field_type.endswith('[]') and field_type[:-2] not in prisma_type_to_cs_type and field_type[:-2] != 'String':
                    cs_type = f"ICollection<{field_type[:-2]}>"
                    is_list_relation = True

                fields.append({
                    'name': field_name,
                    'type': cs_type,
                    'is_id': '@id' in line,
                    'is_unique': '@unique' in line,
                    'is_relation': is_relation or is_list_relation,
                    'original_line': line
                })
        
        models[model_name] = fields
        
    return enums, models

def generate_cs(enums, models, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate Enums
    for enum_name, values in enums.items():
        cs_code = f"namespace UEFGallery.API.Models;\n\npublic enum {enum_name}\n{{\n"
        for v in values:
            cs_code += f"    {v},\n"
        cs_code += "}\n"
        
        with open(os.path.join(output_dir, f"{enum_name}.cs"), 'w', encoding='utf-8') as f:
            f.write(cs_code)
            
    # Generate Models
    for model_name, fields in models.items():
        cs_code = "using System;\nusing System.Collections.Generic;\nusing System.ComponentModel.DataAnnotations;\nusing System.ComponentModel.DataAnnotations.Schema;\n\n"
        cs_code += "namespace UEFGallery.API.Models;\n\n"
        cs_code += f"public class {model_name}\n{{\n"
        
        for f in fields:
            # Capitalize field name
            prop_name = f['name'][0].upper() + f['name'][1:]
            prop_type = f['type']
            
            if f['is_id']:
                cs_code += "    [Key]\n"
                
            if prop_type == 'List<string>':
                cs_code += f"    public {prop_type} {prop_name} {{ get; set; }} = new List<string>();\n"
            elif prop_type.startswith('ICollection'):
                cs_code += f"    public {prop_type} {prop_name} {{ get; set; }} = new List<{prop_type[12:-1]}>();\n"
            else:
                if prop_type == 'string' and not f['is_relation']:
                    cs_code += f"    public {prop_type} {prop_name} {{ get; set; }} = string.Empty;\n"
                else:
                    cs_code += f"    public {prop_type} {prop_name} {{ get; set; }}\n"
                    
            cs_code += "\n"
            
        cs_code += "}\n"
        
        with open(os.path.join(output_dir, f"{model_name}.cs"), 'w', encoding='utf-8') as f:
            f.write(cs_code)
            
    # Generate DbContext
    cs_code = "using Microsoft.EntityFrameworkCore;\n\nnamespace UEFGallery.API.Data;\n\n"
    cs_code += "public class GalleryDbContext : DbContext\n{\n"
    cs_code += "    public GalleryDbContext(DbContextOptions<GalleryDbContext> options) : base(options) { }\n\n"
    
    for model_name in models.keys():
        cs_code += f"    public DbSet<Models.{model_name}> {model_name}s {{ get; set; }}\n"
        
    cs_code += "\n    protected override void OnModelCreating(ModelBuilder modelBuilder)\n    {\n"
    cs_code += "        base.OnModelCreating(modelBuilder);\n"
    cs_code += "        // Add fluent API configurations here if needed\n"
    cs_code += "    }\n}\n"
    
    os.makedirs(os.path.join(output_dir, '../Data'), exist_ok=True)
    with open(os.path.join(output_dir, '../Data/GalleryDbContext.cs'), 'w', encoding='utf-8') as f:
        f.write(cs_code)

if __name__ == "__main__":
    schema_path = "prisma/schema.prisma"
    output_dir = "UEFGallery.API/Models"
    enums, models = parse_prisma(schema_path)
    generate_cs(enums, models, output_dir)
    print(f"Generated {len(enums)} enums and {len(models)} models.")
