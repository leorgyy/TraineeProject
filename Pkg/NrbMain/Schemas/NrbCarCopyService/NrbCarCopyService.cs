namespace BPMSoft.Configuration
{
	using System;
	using System.Configuration;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using System.ServiceModel.Activation;
	using BPMSoft.Common;
	using BPMSoft.Core;
	using BPMSoft.Web.Common;
	using DotNetOpenAuth.OpenId;
	using System.Collections.Generic;
	using NrbCarHelper;
	using NrbValidationHelper;
	using DocumentFormat.OpenXml.Presentation;
	using RestSharp;
	using System.Web.Script.Services;
	using Twilio.Rest.Trunking.V1;

	/// <summary>
	/// Сервис копирования автомобиля.
	/// </summary>
	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class NrbCarCopyService : BaseService
	{

		/// <summary>
		/// Копирует автомобиль.
		/// </summary>
		/// <param name="id">Id автомобиля.</param>
		/// <returns>Ответ сервиса.</returns>
		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "CopyCar", BodyStyle = WebMessageBodyStyle.Wrapped,
			RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
		public ConfigurationServiceResponse CopyCar(Guid id)
		{
			ValidationHelper.CheckEmptyGuid(id);

			try
			{
				new CarCopyHelper(UserConnection).CopyCarRecord(id);
			}
			catch (Exception error)
			{
				return new ConfigurationServiceResponse(error);
			}

			return new ConfigurationServiceResponse();
		}
	}
}

