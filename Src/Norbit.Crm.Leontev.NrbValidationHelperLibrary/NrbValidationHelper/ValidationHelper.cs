using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Norbit.Crm.Leontev.NrbValidationHelper
{
	/// <summary>
	/// Хелпер валидации.
	/// </summary> 
	public static class ValidationHelper
	{
		/// <summary>
		/// Проверяет Guid на пустое значение.
		/// </summary>
		/// <param name="value">Значение.</param>
		/// <exception cref="ArgumentException">Значение не должно быть пустым.</exception>
		public static void CheckEmptyGuid(Guid value)
		{
			if (value == Guid.Empty)
			{
				throw new ArgumentException("Значение не должно быть пустым", nameof(value));
			}
		}

		/// <summary>
		/// Проверяет значение на null.
		/// </summary>
		/// <typeparam name="T">Тип значения</typeparam>
		/// <param name="value">Значение</param>
		/// <exception cref="ArgumentNullException">Значение не должно быть равным null</exception>
		public static void CheckNullValue <T>(T value)
		{
			if (value == null)
			{
				throw new ArgumentNullException(nameof(value), "Значение не должно быть равным null");
			}
		}

		/// <summary>
		/// Сравнивает <paramref name="value"/> c <paramref name="boundValue"/>.
		/// </summary>
		/// <param name="value">Проверяемое значение.</param>
		/// <param name="boundValue">Нижнее граничное значение.</param>
		/// <exception cref="ArgumentException"><paramref name="value"/> меньше или равен <paramref name="boundValue"/>.</exception>
		public static void CheckBoundValue(double value, double boundValue)
		{
			if (value < boundValue)
			{
				throw new ArgumentException($"Аргумент не должен быть меньше {boundValue}", nameof(value));
			}
		}

		/// <summary>
		/// Проверяет строку на пустоту.
		/// </summary>
		/// <param name="inputString">Проверяемая строка.</param>
		/// <exception cref="ArgumentNullException">Пустая строка.</exception>
		public static void CheckEmptyString(string inputString)
		{
			if (string.IsNullOrEmpty(inputString))
			{
				throw new ArgumentNullException(nameof(inputString), "Строка не должна быть пустой");
			}
		}
	}
}
