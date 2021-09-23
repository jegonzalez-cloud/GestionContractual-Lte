import Swal from "sweetalert2";
import {HttpHeaders} from "@angular/common/http";
import * as contratacionDirecta from "./xmls/contratacionDirecta";

export function showAlert(msj: string, type: any) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  Toast.fire({
    icon: type,
    title: msj,
  });
}


export function sendSoapData(infoProceso:any) {
  console.log(infoProceso);
  let codigoEntidad = atob(localStorage.getItem('codigoEntidad')!);
  let usuarioConect = atob(localStorage.getItem('usuarioConect')!);
  let conectPw = atob(localStorage.getItem('conectPw')!);
  let userCodeSecop = atob(localStorage.getItem('userCodeSecop')!);
  let codigoUNSPSC = infoProceso.CODIGO_UNSPSC;

  let duracion = (infoProceso.DURACION_CONTRATO == 'Años') ? 'Years' :
    (infoProceso.DURACION_CONTRATO == 'Meses') ? 'Months' :
      (infoProceso.DURACION_CONTRATO == 'Semanas') ? 'WeekDays' :
        (infoProceso.DURACION_CONTRATO == 'Dias') ? 'Days' :
          (infoProceso.DURACION_CONTRATO == 'Horas') ? 'Hours' : '';
  //   console.log('fatossss')
  //   let data = `<?xml version="1.0" encoding="utf-8"?>
  // <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
  //    <soapenv:Header/>
  //    <soapenv:Body>
  //       <tem:Add>
  //          <tem:intA>15</tem:intA>
  //          <tem:intB>4</tem:intB>
  //       </tem:Add>
  //    </soapenv:Body>
  // </soapenv:Envelope>`;

  let datos = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:con="http://www.nextway.pt/externalintegration/Connect" xmlns:vor="http://schemas.datacontract.org/2004/07/Vortal.CommonLibrary.SOA" xmlns:soa="http://www.nextway.pt/commonLibrary/soa">
  <soapenv:Header>
    <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
      <wsse:UsernameToken wsu:Id="UsernameToken-32" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        <wsse:Username>`+usuarioConect+`</wsse:Username>
        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">`+conectPw+`</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
    <con:Info>
      <vor:CompanyCode>`+codigoEntidad+`</vor:CompanyCode>
      <vor:UserCode>`+infoProceso.USS_CODIGO_USUARIO+`</vor:UserCode>
    </con:Info>
  </soapenv:Header>
  <soapenv:Body>
    <con:CreateProcedureRequestMessage>
    <con:BuyerDossierData>
    <con:AcquisitionFromAnnualPurchasingPlan>false</con:AcquisitionFromAnnualPurchasingPlan>
    <con:Category>
<con:Code>`+codigoUNSPSC+`</con:Code>
<con:Norm>UNSPSC</con:Norm>
     </con:Category>
     <con:ContractEndDate>`+infoProceso.FECHA_TERMINO+`</con:ContractEndDate>
     <con:CommercialAgreement>false</con:CommercialAgreement>
     <con:Description>`+infoProceso.DESCRIPCION_PROCESO+`</con:Description>
<con:Duration>`+infoProceso.TIEMPO_DURACION_CONTRATO+`</con:Duration>
<con:DurationType>`+duracion+`</con:DurationType>
<con:IsRelatedToBuyerDossier>false</con:IsRelatedToBuyerDossier>
<con:JustificationTypeOfContractCode>ManifestUrgency</con:JustificationTypeOfContractCode>
<con:Name>`+infoProceso.NOMBRE_PROCESO+`</con:Name>
<con:OperationReference>`+infoProceso.UNI_CONTRATACION+`</con:OperationReference>
<con:Reference>`+infoProceso.CONS_PROCESO+`</con:Reference>
<con:TypeOfContractCode>`+infoProceso.TIPO_CONTRATO+`</con:TypeOfContractCode>
</con:BuyerDossierData>
     <con:EProcurementProfileIdentifier>`+infoProceso.TIPO_PROCESO+`</con:EProcurementProfileIdentifier>
     <con:DefineLots>false</con:DefineLots>
     <con:FrameworkAgreement>false</con:FrameworkAgreement>
     <con:ProcedureRequestData>
                <con:Dates>
                  <vor:NewEntities>
                    <vor:Items>
                      <con:DateExternalIntegrationCreate>
                        <con:DateUniqueIdentifier>ContractSignatureDate</con:DateUniqueIdentifier>
                        <con:Value>`+infoProceso.FIRMA_CONTRATO+`</con:Value>
                      </con:DateExternalIntegrationCreate>
                      <con:DateExternalIntegrationCreate>
                        <con:DateUniqueIdentifier>StartDateExecutionOfContract</con:DateUniqueIdentifier>
                        <con:Value>`+infoProceso.FECHA_INICIO+`</con:Value>
                      </con:DateExternalIntegrationCreate>
                      <con:DateExternalIntegrationCreate>
                        <con:DateUniqueIdentifier>ExecutionOfContractTerm</con:DateUniqueIdentifier>
                        <con:Value>`+infoProceso.PLAZO_EJECUCION+`</con:Value>
                      </con:DateExternalIntegrationCreate>
                    </vor:Items>
                  </vor:NewEntities>
                </con:Dates>
                <con:Name>`+infoProceso.NOMBRE_PROCESO+`</con:Name>
                <con:DefineLots>false</con:DefineLots>
              </con:ProcedureRequestData>
    </con:CreateProcedureRequestMessage>
  </soapenv:Body>
</soapenv:Envelope>`;
  // let contratacion = contratacionDirecta.createXml(infoProceso);
  // console.log(contratacion)
  let xmlhttp = new XMLHttpRequest();
  // xmlhttp.open('POST', 'http://www.dneonline.com/calculator.asmx?wsdl', true);
  xmlhttp.open('POST', 'https://marketplace-formacion.secop.gov.co/CO1ExternalIntegrationPublicServicesConnect/Connect/ConnectPublicService.svc?wsdl', true);
  //
  xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
  xmlhttp.setRequestHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  xmlhttp.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  xmlhttp.setRequestHeader('Referrer-Policy', 'origin');
  xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
  xmlhttp.setRequestHeader('responseType', 'text');
  xmlhttp.setRequestHeader('Connection', 'keep-alive');
  xmlhttp.setRequestHeader('soapAction', 'http://www.nextway.pt/externalintegration/Connect/IConnectPublicService/CreateProcedure');

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4) {
      let parser = new DOMParser();
      let XMLString = parser.parseFromString(xmlhttp.responseText, "text/xml");
      console.log(XMLString)
      showAlert('Proceso creado exitosamente en el Secop!','success');
    }
  };

  //send the SOAP request
  xmlhttp.send(datos);//comente
  // xmlhttp.send(contratacion);//comente
  // xmlhttp.send(data);
}
