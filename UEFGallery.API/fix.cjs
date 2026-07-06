const fs = require('fs');
let content = fs.readFileSync('Controllers/AdminController.cs', 'utf8');

const dtos = `}

public class LockUserDto
{
    public bool IsActive { get; set; }
}

public class SetArtworkStatusDto
{
    public bool IsPublic { get; set; }
}

public class ToggleHighlightDto
{
    public bool IsHighlighted { get; set; }
}

public class UpdateUserRoleDto
{
    public string Role { get; set; } = string.Empty;
}
`;
// Replace the exact DTO string with just } to close the controller, wait no, 
// the controller shouldn't close there, it should just continue. But wait!
// If I replace `dtos` with ``, then the controller won't close, and the endpoints will be inside it.
// Then I can append `dtos` to the end of the file!

// But `dtos` includes the `}` that closes `AdminController`.
// If I replace it with ``, `AdminController` will not be closed at line 282.
// Then it will be closed at line 401!
content = content.replace(dtos, '\r\n');
content = content + '\r\n' + dtos;

fs.writeFileSync('Controllers/AdminController.cs', content);
