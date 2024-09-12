-- Выбирает косвенные роли пользователя.
CREATE OR ALTER PROCEDURE [dbo].SysAdminUnit$ShowUserRoles
	@UserId uniqueIdentifier
AS
BEGIN
	SELECT DISTINCT
		unit.[Name]
	FROM [dbo].[SysAdminUnitInRole] unitRole
		JOIN [dbo].[SysAdminUnit] unit
			ON unitRole.[SysAdminUnitRoleId] = unit.[Id]
		JOIN [dbo].[SysUserInRole] userRole
			ON userRole.[SysUserId] = @UserId
	WHERE
		unitRole.[SysAdminUnitId] = @UserId
		AND unitRole.[SysAdminUnitRoleId] <> @UserId
		AND userRole.[SysRoleId] <> unitRole.[SysAdminUnitRoleId]
END
GO