package Spring.API.qdb.dto;

import lombok.Data;

@Data
public class ChangePasswordDto {
    private Long userId;
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}
