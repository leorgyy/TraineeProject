using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Net;
using NrbValidationHelper;
using Newtonsoft.Json;

namespace Norbit.Crm.Leontev.ContactCommunicationRequests
{
	/// <summary>
	/// Авторизация пользователя.
	/// </summary>
	public class UserAuthorization
	{
		/// <summary>
		/// Куки авторизации.
		/// </summary>
		public CookieContainer AuthorizationCookie { get; private set; }

		/// <summary>
		/// Токен BPMCSRF.
		/// </summary>
		public string BpmCsrfToken { get; private set; }

		/// <summary>
		/// Авторизация.
		/// </summary>
		public void Login()
		{
			var authUrl = ConfigurationManager.AppSettings["URL"]
				+ ConfigurationManager.AppSettings["AuthorizationService"];

			var authBody = new
			{
				UserName = ConfigurationManager.AppSettings["Login"],
				UserPassword = ConfigurationManager.AppSettings["Password"],
			};

			var loginRequest = LoginRequest(authUrl, JsonConvert.SerializeObject(authBody));
			AuthorizationCookie = new CookieContainer();
			loginRequest.CookieContainer = AuthorizationCookie;

			using (var loginResponse = (HttpWebResponse)loginRequest.GetResponse())
			{
				if (loginResponse.StatusCode == HttpStatusCode.OK)
				{
					BpmCsrfToken = AuthorizationCookie
						.GetCookies(new Uri(authUrl))["BPMCSRF"]
						.Value;
				}
			}
		}

		/// <summary>
		/// Получает запрос авторизации.
		/// </summary>
		/// <param name="requestUrl">Url запроса.</param>
		/// <param name="requestBody">Тело запроса.</param>
		/// <returns></returns>
		private HttpWebRequest LoginRequest(string requestUrl, string requestBody)
		{
			ValidationHelper.CheckEmptyString(requestUrl);
			ValidationHelper.CheckEmptyString(requestBody);

			var loginRequest = (HttpWebRequest)WebRequest.Create(requestUrl);

			loginRequest.Method = "POST";
			loginRequest.ContentType = "application/json";
			loginRequest.KeepAlive = true;

			using (var requestStream = loginRequest.GetRequestStream())
			{
				using (var streamWriter = new StreamWriter(requestStream))
				{
					streamWriter.Write(requestBody);
				}
			}

			return loginRequest;
		}
	}
}