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
using System.Runtime.Serialization;
using NrbMaintenanceHelper;
using BPMSoft.Core.Configuration;
using BPMSoft.Core.DB;

namespace BPMSoft.Configuration
{
	/// <summary>
	/// Сервис работы с ТО машины.
	/// </summary>
	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class NrbMaintenanceService : BaseService
	{
		/// <summary>
		/// Обновление записей в детали ТО.
		/// </summary>
		/// <param name="recordId">Id записи.</param>
		/// <param name="isNew">Новизна записи.</param>
		/// <returns>Результат работы сервиса ТО.</returns>
		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "UpdateCarRecord", BodyStyle = WebMessageBodyStyle.Wrapped,
			RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]

		public MaintenanceServiceResponse UpdateCarRecord(string recordId, bool isNew)
		{
			ValidationHelper.CheckEmptyString(recordId);
			ValidationHelper.CheckNullValue(isNew);

			var operationResponse = new MaintenanceOperationResponse("null", false);

			try
			{
				var maintenanceRecordManager = new MaintenanceRecordManager(UserConnection);

				operationResponse = isNew
					? maintenanceRecordManager.SaveNewMaintenanceRecord(new Guid(recordId))
					: maintenanceRecordManager.UpdateMaintenanceRecords(new Guid(recordId));
			}
			catch (Exception error)
			{
				return new MaintenanceServiceResponse(error);
			}

			return new MaintenanceServiceResponse(operationResponse);
		}

		/// <summary>
		/// Получение самой мощной машины.
		/// </summary>
		/// <param name="carType">Тип машины</param>
		/// <param name="maxPower">Максимальная мощность.</param>
		/// <returns>Результат работы процедуры</returns>
		[OperationContract]
		[WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped,
			RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
		public ProcedureServiceResponse GetMostPowerfulCar(Guid carType, double maxPower)
		{
			ValidationHelper.CheckEmptyGuid(carType);
			ValidationHelper.CheckBoundValue(maxPower, 0);

			var serviceResponse = new ProcedureServiceResponse();

			try
			{
				var procedure = (StoredProcedure)new StoredProcedure(UserConnection, "NrbCar$FindMostPowerfulCar")
					.WithParameter("CarType", carType)
					.WithParameter("MaxPower", maxPower)
					.WithOutputParameter("Name", (ShortTextDataValueType)UserConnection.DataValueTypeManager.GetInstanceByName("ShortText"))
					.WithOutputParameter("Power", (Float2DataValueType)UserConnection.DataValueTypeManager.GetInstanceByName("Float"))
					.WithOutputParameter("Price", (Float2DataValueType)UserConnection.DataValueTypeManager.GetInstanceByName("Float"));

				procedure.PackageName = "NrbMain";
				procedure.Execute();

				serviceResponse.Name = (string)procedure.Parameters.FindByName("Name").Value;
				serviceResponse.Power = (decimal)procedure.Parameters.FindByName("Power").Value;
				serviceResponse.Price = (decimal)procedure.Parameters.FindByName("Price").Value;
				serviceResponse.Success = true;
			}
			catch (Exception error)
			{
				return new ProcedureServiceResponse(error);
			}
			
			return serviceResponse;
		}
	}

	/// <summary>
	/// Ответ сервиса при сохранении записи.
	/// </summary>
	[DataContract]
	public class MaintenanceServiceResponse : ConfigurationServiceResponse
	{
		/// <summary>
		/// Тип операции.
		/// </summary>
		[DataMember(Name = "OperationType")]
		public string OperationType { get; set; }

		/// <summary>
		/// Количество строк.
		/// </summary>
		[DataMember(Name = "RecordCount")]
		public int RecordCount { get; set; }

		/// <summary>
		/// Создает ответ веб-сервиса на основе ответа операции.
		/// </summary>
		/// <param name="operationResponse">Результат операции.</param>
		public MaintenanceServiceResponse(MaintenanceOperationResponse operationResponse)
			: base()
		{
			OperationType = operationResponse.OperationType;
			RecordCount = operationResponse.RecordCount;
			Success = operationResponse.OperationResult;
		}

		/// <summary>
		/// Создает ответ с ошибкой.
		/// </summary>
		/// <param name="error">Ошибка.</param>
		public MaintenanceServiceResponse(Exception error)
			: base(error)
		{

		}
	}

	/// <summary>
	/// Ответ сервиса при выполенении хранимой процедуры.
	/// </summary>
	[DataContract]
	public class ProcedureServiceResponse : ConfigurationServiceResponse
	{
		/// <summary>
		/// Название машины.
		/// </summary>
		[DataMember(Name = "Name")]
		public string Name { get; set; }

		/// <summary>
		/// Мощность.
		/// </summary>
		[DataMember(Name = "Power")]
		public decimal Power { get; set; }

		/// <summary>
		/// Цена.
		/// </summary>
		[DataMember(Name = "Price")]
		public decimal Price { get; set; }

		/// <summary>
		/// Создает стандартный ответ.
		/// </summary>
		public ProcedureServiceResponse()
		   : base()
		{

		}

		/// <summary>
		/// Создает ответ с ошибкой.
		/// </summary>
		/// <param name="error">Ошибка.</param>
		public ProcedureServiceResponse(Exception error)
			: base(error)
		{
			
		}
	}
}

