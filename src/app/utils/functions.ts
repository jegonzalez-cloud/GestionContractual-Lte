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


export function sendSoapData() {
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
        <wsse:Username>700192024_210826174227</wsse:Username>
        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">|1:;8KTb4=</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
    <con:Info>
      <vor:CompanyCode>700192024</vor:CompanyCode>
      <vor:UserCode>2422012</vor:UserCode>
    </con:Info>
  </soapenv:Header>
  <soapenv:Body>
    <con:CreateProcedureRequestMessage>
    <con:BuyerDossierData>
    <con:AcquisitionFromAnnualPurchasingPlan>false</con:AcquisitionFromAnnualPurchasingPlan>
    <con:Category>
<con:Code>26111500</con:Code>
<con:Norm>UNSPSC</con:Norm>
     </con:Category>
     <con:ContractEndDate>2022-04-13T14:35:40.659Z</con:ContractEndDate>
     <con:CommercialAgreement>false</con:CommercialAgreement>
     <con:Description>Connect_Desc</con:Description>
<con:Duration>12</con:Duration>
<con:DurationType>Months</con:DurationType>
<con:IsRelatedToBuyerDossier>false</con:IsRelatedToBuyerDossier>
<con:JustificationTypeOfContractCode>ManifestUrgency</con:JustificationTypeOfContractCode>
<con:Name>44 Proceso Secop</con:Name>
<con:OperationReference>UNIDADX</con:OperationReference>
<con:Reference>0044</con:Reference>
<con:TypeOfContractCode>ServicesProvisioning</con:TypeOfContractCode>
</con:BuyerDossierData>
     <con:EProcurementProfileIdentifier>CCE-16-Servicios_profesionales_gestion</con:EProcurementProfileIdentifier>
     <con:ProcedureRequestData>
      <con:ContractSignatureDate>2022-04-13T14:35:40.659Z</con:ContractSignatureDate>
      <con:StartDateExecutionOfContract>2022-05-13T14:35:40.659Z</con:StartDateExecutionOfContract>
<con:ExecutionOfContractTerm>2022-04-13T14:35:40.659Z</con:ExecutionOfContractTerm>
<con:DefineLots>false</con:DefineLots>
<con:DefineBasePrice>true</con:DefineBasePrice>
<con:InitialContractValue>500000</con:InitialContractValue>
<con:FrameworkAgreement>false</con:FrameworkAgreement>
      </con:ProcedureRequestData>
    </con:CreateProcedureRequestMessage>
  </soapenv:Body>
</soapenv:Envelope>`;
  //let contratacion = contratacionDirecta.createXml('700192024_210826174227', '|1:;8KTb4=', '700192024', '2422012', 'prueba_Angula', '26111500', 'false', 'UNIDADX', 'objeto referencia', 'ServicesProvisioning', 'ManifestUrgency', '2022-09-08T11:08', '4', 'CCE-16-Servicios_profesionales_gestion', '2021-09-08T11:08', '2021-09-08T11:08', '2021-09-08T11:08');
  // console.log(contratacion)
  let xmlhttp = new XMLHttpRequest();
  // xmlhttp.open('POST', 'http://www.dneonline.com/calculator.asmx?wsdl', true);
  xmlhttp.open('POST', 'https://marketplace-formacion.secop.gov.co/CO1ExternalIntegrationPublicServicesConnect/Connect/ConnectPublicService.svc?wsdl', true);

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
      // console.log(XMLString.getElementsByTagName('AddResult')[0].innerHTML)
    }
  };

  //send the SOAP request
  xmlhttp.send(datos);
  // xmlhttp.send(data);
}
