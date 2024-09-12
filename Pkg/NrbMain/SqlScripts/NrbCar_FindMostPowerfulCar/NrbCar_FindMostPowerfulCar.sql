/**
 * Находит самый мощный автомобиль.
 */
CREATE OR ALTER PROCEDURE [dbo].NrbCar$FindMostPowerfulCar
	@CarType uniqueidentifier
	,@MaxPower decimal(18, 2)

	,@Name nvarchar(250) OUTPUT
	,@Power decimal(18, 2) OUTPUT
	,@Price decimal(18, 2) OUTPUT
AS
BEGIN
	SELECT TOP 1
		@Name = [NrbName]
		,@Power = [NrbPower]
		,@Price = [NrbPrice]
	FROM [dbo].[NrbCar]
	WHERE
		[NrbCarTypeId] = @CarType
		AND [NrbPower] <= @MaxPower
	ORDER BY [NrbPower] DESC
END