using System;
using Npgsql;
using UEFGallery.API.Models;

class Program
{
    static void Main()
    {
        var connectionString = "Host=ep-tiny-mode-aqaqluvi-pooler.c-8.us-east-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_0ItvywJCB4RX;Ssl Mode=Require;Trust Server Certificate=true;";
        
        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        var translator = new Npgsql.NameTranslation.NpgsqlNullNameTranslator();
        dataSourceBuilder.MapEnum<Role>("Role", translator); // try default
        var dataSource = dataSourceBuilder.Build();
        
        using var conn = dataSource.OpenConnection();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT typname FROM pg_type WHERE typcategory = 'E'";
        
        try
        {
            using var reader = cmd.ExecuteReader();
            Console.WriteLine("Enum Types in DB:");
            while (reader.Read())
            {
                Console.WriteLine(reader.GetString(0));
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
