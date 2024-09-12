using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Security.Authentication;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NrbValidationHelper;

namespace Norbit.Crm.Leontev.ContactCommunicationRequests
{
	/// <summary>
	/// OData запрос.
	/// </summary>
	public class ODataRequest
	{
		/// <summary>
		/// Url.
		/// </summary>
		private static readonly string Url = ConfigurationManager.AppSettings["URL"];

		/// <summary>
		/// Тип коммуникации по умолчанию.
		/// </summary>
		private static readonly string CommunicationTypeIdDefault = "EE1C85C3-CFCB-DF11-9B2A-001D60E938C6";

		/// <summary>
		/// Email по умолчанию.
		/// </summary>
		private static readonly string EmailDefault = "newDomainMail@norbit.ru";

		/// <summary>
		/// Получение списка коммуникаций.
		/// </summary>
		/// <param name="authorization">Авторизация.</param>
		/// <param name="contactId">Id контакта.</param>
		/// <returns>Список коммуникаций.</returns>
		/// <exception cref="WebException">Запрос не выполнен</exception>
		public List<string> GetCommunicationsList(UserAuthorization authorization, string contactId)
		{
			ValidationHelper.CheckNullValue(authorization);
			ValidationHelper.CheckEmptyString(contactId);

			var requestUrl = Url
				+ string.Format(ConfigurationManager.AppSettings["CommunicationListRequestUrl"], contactId);

			var request = (HttpWebRequest)WebRequest.Create(requestUrl);

			request.Method = "GET";
			request.ContentType = "application/json";
			request.Headers.Add("BPMCSRF", authorization.BpmCsrfToken);
			request.CookieContainer = authorization.AuthorizationCookie;

			try
			{
				var response = (HttpWebResponse)request.GetResponse();

				using (var streamReader = new StreamReader(response.GetResponseStream()))
				{
					var responseJson = JObject.Parse(streamReader.ReadToEnd());
					var communicationsList = new List<string>();

					foreach (var item in responseJson.Last)
					{
						foreach (var result in item)
						{
							communicationsList.Add(result["Number"].ToString());
						}
					}

					return communicationsList;
				}
			}
			catch (WebException)
			{
				throw new WebException("Запрос не выполнен");
			}
		}

		/// <summary>
		/// Добавление новой коммуникации.
		/// </summary>
		/// <param name="authorization">Авторизация.</param>
		/// <param name="contactId">Id контакта.</param>
		/// <returns>
		/// True - запрос выполнился,
		/// False - в противном случае
		/// </returns>
		/// <exception cref="WebException">Запрос не выполнен</exception>
		public bool AddNewCommunication(UserAuthorization authorization, string contactId)
		{
			ValidationHelper.CheckNullValue(authorization);
			ValidationHelper.CheckEmptyString(contactId);

			var requestUrl = Url
				+ ConfigurationManager.AppSettings["ContactCommunicationUrl"];

			var request = (HttpWebRequest)WebRequest.Create(requestUrl);
			request.Method = "POST";
			request.ContentType = "application/json; odata=verbose";
			request.Headers.Add("BPMCSRF", authorization.BpmCsrfToken);
			request.CookieContainer = authorization.AuthorizationCookie;

			var communication = new
			{
				CommunicationTypeId = CommunicationTypeIdDefault,
				ContactId = contactId,
				Number = EmailDefault
			};

			using (var requestStream = request.GetRequestStream())
			using (var streamWriter = new StreamWriter(requestStream))
			{
				streamWriter.Write(JsonConvert.SerializeObject(communication));
			}

			try
			{
				var response = (HttpWebResponse)request.GetResponse();

				return response.StatusCode == HttpStatusCode.Created;
			}
			catch (Exception)
			{
				throw new WebException("Запрос не выполнен");
			}
		}

		/// <summary>
		/// Удаление коммуникаций.
		/// </summary>
		/// <param name="authorization">Авторизация.</param>
		/// <param name="communicationId">Id коммуникации.</param>
		/// <returns>
		/// True - запрос выполнился,
		/// False - в противном случае
		/// </returns>
		/// <exception cref="WebException">Запрос не выполнен</exception>
		public bool DeleteCommunication(UserAuthorization authorization, string communicationId)
		{
			ValidationHelper.CheckNullValue(authorization);
			ValidationHelper.CheckEmptyString(communicationId);

			var requestUrl = Url
				+ string.Format(ConfigurationManager.AppSettings["ContactCommunicationIdUrl"], communicationId);

			var request = (HttpWebRequest)WebRequest.Create(requestUrl);

			request.Method = "DELETE";
			request.Headers.Add("BPMCSRF", authorization.BpmCsrfToken);
			request.CookieContainer = authorization.AuthorizationCookie;

			try
			{
				var response = (HttpWebResponse)request.GetResponse();

				return response.StatusCode == HttpStatusCode.NoContent;
			}
			catch (WebException)
			{
				throw new WebException("Запрос не выполнен");
			}
		}
	}
}