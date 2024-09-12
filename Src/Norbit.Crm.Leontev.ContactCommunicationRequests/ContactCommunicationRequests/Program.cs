using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Runtime.InteropServices;
using System.Text;
using NrbValidationHelper;

namespace Norbit.Crm.Leontev.ContactCommunicationRequests
{
	/// <summary>
	/// Консольное приложение.
	/// </summary>
	public class Program
	{ 
		/// <summary>
		/// Точка входа в программу.
		/// </summary>
		/// <param name="args"></param>
		private static void Main(string[] args)
		{
			Console.OutputEncoding = Encoding.UTF8;

			StartCommunicationOperations();
		}

		/// <summary>
		/// Старт выполнений операций с коммуникациями.
		/// </summary>
		private static void StartCommunicationOperations()
		{
			var authentication = new UserAuthorization();
			authentication.Login();

			var oDataRequest = new ODataRequest();

			GetCommunicationList(authentication, oDataRequest);
			AddCommunication(authentication, oDataRequest);
			DeleteCommunication(authentication, oDataRequest);
		}

		/// <summary>
		/// Получение списка коммуникаций.
		/// </summary>
		/// <param name="authorization">Авторизация.</param>
		/// <param name="oDataRequest">Odata запрос.</param>
		private static void GetCommunicationList(UserAuthorization authorization, ODataRequest oDataRequest)
		{
			Console.WriteLine("Получение списка коммуникаций контакта");

			var communicationList = oDataRequest.GetCommunicationsList(
				authorization, 
				GetUserInput("Введите Id контакта"));

			ShowList(communicationList);
		}

		/// <summary>
		/// Добавление коммуникации.
		/// </summary>
		/// <param name="authorization">Авторизация.</param>
		/// <param name="oDataRequest">Odata запрос.</param>
		private static void AddCommunication(UserAuthorization authorization, ODataRequest oDataRequest)
		{
			Console.WriteLine("Добавление коммуникации контакту");

			Console.WriteLine(oDataRequest.AddNewCommunication(authorization, GetUserInput("Введите Id контакта"))
				? "Коммуникация успешно добавлена"
				: "Ошибка добавления коммуникации");
		}

		/// <summary>
		/// Удаление коммуникации.
		/// </summary>
		/// <param name="authorization">Авторизация.</param>
		/// <param name="oDataRequest">Odata запрос.</param>
		private static void DeleteCommunication(UserAuthorization authorization, ODataRequest oDataRequest) 
		{
			Console.WriteLine("Удаление коммуникации");

			Console.WriteLine(oDataRequest.DeleteCommunication(authorization, GetUserInput("Введите Id коммуникации"))
				? "Коммуникация успешно удалена"
				: "Ошибка удаления коммуникации");
		}

		/// <summary>
		/// Показывает элементы списка.
		/// </summary>
		/// <typeparam name="T">Тип списка.</typeparam>
		/// <param name="list">Список.</param>
		private static void ShowList<T>(List<T> list)
		{
			ValidationHelper.CheckNullValue(list);

			foreach (var item in list)
			{
				Console.WriteLine(item);
			}
		}

		/// <summary>
		/// Получение ввода пользователя.
		/// </summary>
		/// <param name="message">Выводимое сообщение</param>
		/// <returns></returns>
		private static string GetUserInput(string message)
		{
			ValidationHelper.CheckEmptyString(message);
			Console.WriteLine(message);

			return Console.ReadLine();
		}
	}
}