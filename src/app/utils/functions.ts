import Swal from "sweetalert2";
import {HttpHeaders} from "@angular/common/http";
import * as contratacionDirecta from "./xmls/contratacionDirecta";
import {callback, resolve} from "chart.js/helpers";
import {delay} from "rxjs/operators";
import {ProcessComponent} from "../pages/process/process.component";
import {FormBuilder} from "@angular/forms";

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

export async function getCdpData(centroGestor:string,cdp:string) {
  let xmlhttp = new XMLHttpRequest();
  let monto = '';
  xmlhttp.open('POST', 'http://sapqa-ci.valledelcauca.gov.co:8000/sap/bc/srt/rfc/sap/zws_dispo_presupuestal/710/zws_dispopresupuestal/zbind_dispopresupuestal', true);
  xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
  xmlhttp.setRequestHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  xmlhttp.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  xmlhttp.setRequestHeader('Referrer-Policy', 'origin');
  xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
  xmlhttp.setRequestHeader('responseType', 'text');
  xmlhttp.setRequestHeader('soapAction', 'urn:sap-com:document:sap:soap:functions:mc-style:ZWS_DISPO_PRESUPUESTAL:ZmfWsDispoPresupuestalRequest');
  // xmlhttp.setRequestHeader('Connection', 'keep-alive');
  // xmlhttp.setRequestHeader('soapAction', 'http://www.nextway.pt/externalintegration/Connect/IConnectPublicService/CreateProcedure');

  let datos = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZmfWsDispoPresupuestal>
         <ImCentroges>`+centroGestor+`</ImCentroges>
         <ImNumeroCpd>`+cdp+`</ImNumeroCpd>
      </urn:ZmfWsDispoPresupuestal>
   </soapenv:Body>
</soapenv:Envelope>`;

  xmlhttp.send(datos);

  // @ts-ignore
  xmlhttp.onreadystatechange = async function() {
    if (xmlhttp.readyState == 4) {
      let parser = new DOMParser();
      let XMLString = parser.parseFromString(xmlhttp.responseText, "text/xml");
      monto = (XMLString.getElementsByTagName("soap-env:Body")[0].getElementsByTagName("n0:ZmfWsDispoPresupuestalResponse")[0].getElementsByTagName("ExDisponibilidad")[0].innerHTML == null) ? '' : XMLString.getElementsByTagName("soap-env:Body")[0].getElementsByTagName("n0:ZmfWsDispoPresupuestalResponse")[0].getElementsByTagName("ExDisponibilidad")[0].innerHTML ;
      if (monto != null && monto.length > 0) {
      } else {
        showAlert('No se logro consultar el CDP!', 'error');
        monto = '';
      }
    }
  };
  await sleep(500);
  return monto;
}


function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function sendSoapData(infoProceso: any, unspsc: any) {
  let codigoEntidad = atob(localStorage.getItem('codigoEntidad')!);
  let usuarioConect = atob(localStorage.getItem('usuarioConect')!);
  let conectPw = atob(localStorage.getItem('conectPw')!);
  let userCodeSecop = atob(localStorage.getItem('userCodeSecop')!);
  // let codigoUNSPSC = infoProceso.CODIGO_UNSPSC;
  let codigoUNSPSC = unspsc[0].uns_codigo;
  let arrayCodigoUNSPSC = [];
  let adicionalUNSPSC = '';
  let cuestionarioUNSPSC = '';
  for (let i = 0; i < unspsc.length; i++) {
    // if(i <= unspsc.length){
    adicionalUNSPSC +=
      `<con:AdditionalCategory>
          <vor:NewEntities>
          <vor:Items>
          <con:AdditionalCategorizationExternalIntegrationCreate>
          <con:MainCategory>
          <con:Code>` + unspsc[i].uns_codigo + `</con:Code>
          <con:Norm>UNSPSC</con:Norm>
          </con:MainCategory>
          </con:AdditionalCategorizationExternalIntegrationCreate>
          </vor:Items>
          </vor:NewEntities>
          </con:AdditionalCategory>`;
    cuestionarioUNSPSC +=
      `<con:LineQuestionExternalIntegrationCreate>
        <con:CategoryCode>` + unspsc[i].uns_codigo + `</con:CategoryCode>
        <con:CeilingPrice>` + (unspsc[i].uns_precio_unitario) + `</con:CeilingPrice>
        <con:CostPrice>` + unspsc[i].uns_precio_unitario + `</con:CostPrice>
        <con:Description>` + unspsc[i].uns_descripcion + `</con:Description>
        <con:LineType>Item</con:LineType>
        <con:Quantity>` + unspsc[i].uns_cantidad + `</con:Quantity>
        <con:Reference>` + (i + 1) + `</con:Reference>
        <con:Unit>` + unspsc[i].uns_unidad + `</con:Unit>
       </con:LineQuestionExternalIntegrationCreate>`
    // }
  }
  // if(codigoUNSPSC.includes(',')){
  //   arrayCodigoUNSPSC = codigoUNSPSC.split(',');
  //   codigoUNSPSC = arrayCodigoUNSPSC[0];
  //   // for (let i = 0; i < arrayCodigoUNSPSC.length; i++) {
  //   for (let i = 0; i < unspsc.length; i++) {
  //     if(i <= unspsc.length -2){
  //       adicionalUNSPSC +=
  //         `<con:AdditionalCategory>
  //         <vor:NewEntities>
  //         <vor:Items>
  //         <con:AdditionalCategorizationExternalIntegrationCreate>
  //         <con:MainCategory>
  //         <con:Code>`+unspsc[i+1].UNS_CODIGO+`</con:Code>
  //         <con:Norm>UNSPSC</con:Norm>
  //         </con:MainCategory>
  //         </con:AdditionalCategorizationExternalIntegrationCreate>
  //         </vor:Items>
  //         </vor:NewEntities>
  //         </con:AdditionalCategory>`;
  //     }
  //   }
  // }

  let duracion = (infoProceso.DURACION_CONTRATO == 'Años') ? 'Years' :
    (infoProceso.DURACION_CONTRATO == 'Meses') ? 'Months' :
      (infoProceso.DURACION_CONTRATO == 'Semanas') ? 'WeekDays' :
        (infoProceso.DURACION_CONTRATO == 'Dias') ? 'Days' :
          (infoProceso.DURACION_CONTRATO == 'Horas') ? 'Hours' : '';

  let datos = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:con="http://www.nextway.pt/externalintegration/Connect" xmlns:vor="http://schemas.datacontract.org/2004/07/Vortal.CommonLibrary.SOA" xmlns:soa="http://www.nextway.pt/commonLibrary/soa">
  <soapenv:Header>
    <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
      <wsse:UsernameToken wsu:Id="UsernameToken-32" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        <wsse:Username>` + usuarioConect + `</wsse:Username>
        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">` + conectPw + `</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
    <con:Info>
      <vor:CompanyCode>` + codigoEntidad + `</vor:CompanyCode>
      <vor:UserCode>` + infoProceso.USS_CODIGO_USUARIO + `</vor:UserCode>
    </con:Info>
  </soapenv:Header>
  <soapenv:Body>
    <con:CreateProcedureRequestMessage>
    <con:BuyerDossierData>
    <con:AcquisitionFromAnnualPurchasingPlan>false</con:AcquisitionFromAnnualPurchasingPlan>
    ` + adicionalUNSPSC + `
    <con:Category>
<con:Code>` + codigoUNSPSC + `</con:Code>
<con:Norm>UNSPSC</con:Norm>
     </con:Category>
     <con:ContractEndDate>` + infoProceso.FECHA_TERMINO + `</con:ContractEndDate>
     <con:CommercialAgreement>false</con:CommercialAgreement>
     <con:Description>` + infoProceso.DESCRIPCION_PROCESO + `</con:Description>
<con:Duration>` + infoProceso.TIEMPO_DURACION_CONTRATO + `</con:Duration>
<con:DurationType>` + duracion + `</con:DurationType>
<con:IsRelatedToBuyerDossier>false</con:IsRelatedToBuyerDossier>
<con:JustificationTypeOfContractCode>` + infoProceso.JUST_TIPO_PROCESO + `</con:JustificationTypeOfContractCode>
<con:Name>` + infoProceso.NOMBRE_PROCESO + `</con:Name>
<con:OperationReference>` + infoProceso.UNI_CONTRATACION + `</con:OperationReference>
<con:Reference>` + infoProceso.CONS_PROCESO + `</con:Reference>
<con:TypeOfContractCode>` + infoProceso.TIPO_CONTRATO + `</con:TypeOfContractCode>
</con:BuyerDossierData>
     <con:EProcurementProfileIdentifier>` + infoProceso.TIPO_PROCESO + `</con:EProcurementProfileIdentifier>
     <con:DefineLots>false</con:DefineLots>
     <con:FrameworkAgreement>false</con:FrameworkAgreement>
     <con:ProcedureRequestData>
                <con:Dates>
                  <vor:NewEntities>
                    <vor:Items>
                      <con:DateExternalIntegrationCreate>
                        <con:DateUniqueIdentifier>ContractSignatureDate</con:DateUniqueIdentifier>
                        <con:Value>` + infoProceso.FIRMA_CONTRATO + `</con:Value>
                      </con:DateExternalIntegrationCreate>
                      <con:DateExternalIntegrationCreate>
                        <con:DateUniqueIdentifier>StartDateExecutionOfContract</con:DateUniqueIdentifier>
                        <con:Value>` + infoProceso.FECHA_INICIO + `</con:Value>
                      </con:DateExternalIntegrationCreate>
                      <con:DateExternalIntegrationCreate>
                        <con:DateUniqueIdentifier>ExecutionOfContractTerm</con:DateUniqueIdentifier>
                        <con:Value>` + infoProceso.PLAZO_EJECUCION + `</con:Value>
                      </con:DateExternalIntegrationCreate>
                    </vor:Items>
                  </vor:NewEntities>
                </con:Dates>
                <con:Name>` + infoProceso.NOMBRE_PROCESO + `</con:Name>
                <con:DefineLots>false</con:DefineLots>
                <con:Questionnaires>
                 <vor:NewEntities>
                    <vor:Items>
                       <con:QuestionnaireExternalIntegrationCreate>
                          <con:Questions>
                             <vor:NewEntities>
                                <vor:Items>
                                   <con:QuestionExternalIntegrationCreate>
                                      <con:AddExtraSpecification>false</con:AddExtraSpecification>
                                      <con:AllLinesAreMandatory>true</con:AllLinesAreMandatory>
                                      <con:DefineSpecificCategory>true</con:DefineSpecificCategory>
                                      <con:HelpText>Question</con:HelpText>
                                      <con:IsMandatoryQuestion>true</con:IsMandatoryQuestion>
                                      <con:Lines>
                                         <vor:NewEntities>
                                            <vor:Items>
                                               ` + cuestionarioUNSPSC + `
                                            </vor:Items>
                                         </vor:NewEntities>
                                      </con:Lines>
                                      <con:PriceListScreenConfiguration>BasePriceUNSPSCCfg</con:PriceListScreenConfiguration>
                                      <con:QuestionType>PriceListQuestion</con:QuestionType>
                                      <con:RequiresEvidence>false</con:RequiresEvidence>
                                   </con:QuestionExternalIntegrationCreate>
                                </vor:Items>
                             </vor:NewEntities>
                          </con:Questions>
                       </con:QuestionnaireExternalIntegrationCreate>
                    </vor:Items>
                 </vor:NewEntities>
                </con:Questionnaires>
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
  // xmlhttp.setRequestHeader('Connection', 'keep-alive');
  xmlhttp.setRequestHeader('soapAction', 'http://www.nextway.pt/externalintegration/Connect/IConnectPublicService/CreateProcedure');

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4) {
      let parser = new DOMParser();
      let XMLString = parser.parseFromString(xmlhttp.responseText, "text/xml");
      console.log(XMLString)
      console.log(XMLString.getElementsByTagName("s:Header")[0].getElementsByTagName("h:Success")[0].innerHTML)
      if (XMLString.getElementsByTagName("s:Header")[0].getElementsByTagName("h:Success")[0].innerHTML == null || XMLString.getElementsByTagName("s:Header")[0].getElementsByTagName("h:Success")[0].innerHTML == 'false') {
        showAlert('No se logro crear el proceso en el Secop!', 'error');
      } else {
        showAlert('Proceso creado exitosamente en el Secop!', 'success');
      }

    }
  };

  //send the SOAP request
  xmlhttp.send(datos);//comente
  // xmlhttp.send(contratacion);//comente
  // xmlhttp.send(data);
}
