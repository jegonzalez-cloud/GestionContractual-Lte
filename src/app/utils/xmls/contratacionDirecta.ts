export function createXml(
  username: string, password: string, companyCode: string,
  userCode: string, objeto: string, unspsc:string,
  acuerdosComerciales: string, unidadContratacion: string, numeroProceso:string,
  tipoContrato: string, justificacionTipoContrato: string, fechaterminoContrato:string,
  duracion: string, tipoProceso: string, fechaFirmaContrato:string,
  fechaInicioEjecucionContrato: string, plazoEjecucionContrato: string,equipoContratacion: string
) {
  let xmlContratacionDirecta =
    `<?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:con="http://www.nextway.pt/externalintegration/Connect" xmlns:vor="http://schemas.datacontract.org/2004/07/Vortal.CommonLibrary.SOA" xmlns:soa="http://www.nextway.pt/commonLibrary/soa">
          <soapenv:Header>
            <wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
              <wsse:UsernameToken wsu:Id="UsernameToken-32" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
                <wsse:Username>`+username+`</wsse:Username>
                <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">`+password+`</wsse:Password>
              </wsse:UsernameToken>
            </wsse:Security>
            <con:Info>
              <vor:CompanyCode>`+companyCode+`</vor:CompanyCode>
              <vor:UserCode>`+userCode+`</vor:UserCode>
            </con:Info>
          </soapenv:Header>
          <soapenv:Body>
            <con:CreateProcedureRequestMessage>
              <con:BuyerDossierData>
                <con:AcquisitionFromAnnualPurchasingPlan>false</con:AcquisitionFromAnnualPurchasingPlan>
                <con:Category>
                  <con:Code>`+unspsc+`</con:Code>
                  <con:Norm>UNSPSC</con:Norm>
                </con:Category>
                <con:ContractEndDate>`+fechaterminoContrato+`</con:ContractEndDate>
                <con:CommercialAgreement>`+acuerdosComerciales+`</con:CommercialAgreement>
                <con:Duration>`+duracion+`</con:Duration>
                <con:DurationType>Months</con:DurationType>
                <con:IsRelatedToBuyerDossier>false</con:IsRelatedToBuyerDossier>
                <con:TypeOfContractCode>`+tipoContrato+`</con:TypeOfContractCode>
                <con:JustificationTypeOfContractCode>ManifestUrgency</con:JustificationTypeOfContractCode>
                <con:Name>`+objeto+`</con:Name>
                <con:OperationReference>`+unidadContratacion+`</con:OperationReference>
                <con:Reference>`+numeroProceso+`</con:Reference>
              </con:BuyerDossierData>
              <con:EProcurementProfileIdentifier>`+tipoProceso+`</con:EProcurementProfileIdentifier>
              <con:ProcedureRequestData>
                <con:Dates>
                  <vor:NewEntities>
                    <vor:Items>
                      <con:DateExternalIntegrationCreate>
                        <con:DateUniqueIdentifier>ContractSignatureDate</con:DateUniqueIdentifier>
                        <con:Value>`+fechaFirmaContrato+`</con:Value>
                      </con:DateExternalIntegrationCreate>
                      <con:DateExternalIntegrationCreate>
                        <con:DateUniqueIdentifier>StartDateExecutionOfContract</con:DateUniqueIdentifier>
                        <con:Value>`+fechaInicioEjecucionContrato+`</con:Value>
                      </con:DateExternalIntegrationCreate>
                      <con:DateExternalIntegrationCreate>
                        <con:DateUniqueIdentifier>ExecutionOfContractTerm</con:DateUniqueIdentifier>
                        <con:Value>`+plazoEjecucionContrato+`</con:Value>
                      </con:DateExternalIntegrationCreate>
                    </vor:Items>
                  </vor:NewEntities>
                </con:Dates>
                <con:Name>`+objeto+`</con:Name>
                <con:DefineLots>false</con:DefineLots>
              </con:ProcedureRequestData>
              <con:ProcedureTeamIntegrationUniqueIdentifier>`+equipoContratacion+`</con:ProcedureTeamIntegrationUniqueIdentifier>
            </con:CreateProcedureRequestMessage>
          </soapenv:Body>
        </soapenv:Envelope>`;

  return xmlContratacionDirecta;
}

//                <con:DefineBasePrice>true</con:DefineBasePrice>
//                 <con:FinancialSettings>
//                   <con:DefinePaymentPlan>false</con:DefinePaymentPlan>
//                   <con:Warranties>false</con:Warranties>
//                 </con:FinancialSettings>
//                 <con:FrameworkAgreement>false</con:FrameworkAgreement>
//                 <con:Questionnaires>
//                   <vor:NewEntities>
//                     <vor:Items>
//                       <con:QuestionnaireExternalIntegrationCreate>
//                         <con:Questions>
//                           <vor:NewEntities>
//                             <vor:Items>
//                               <con:QuestionExternalIntegrationCreate>
//                                 <con:AddExtraSpecification>false</con:AddExtraSpecification>
//                                 <con:AllLinesAreMandatory>true</con:AllLinesAreMandatory>
//                                 <con:DefineSpecificCategory>true</con:DefineSpecificCategory>
//                                 <con:HelpText>Question 111</con:HelpText>
//                                 <con:IsMandatoryQuestion>true</con:IsMandatoryQuestion>
//                                 <con:Lines>
//                                   <vor:NewEntities>
//                                     <vor:Items>
//                                       <con:LineQuestionExternalIntegrationCreate>
//                                         <con:CategoryCode>24101600</con:CategoryCode>
//                                         <con:CeilingPrice>50</con:CeilingPrice>
//                                         <con:CostPrice>5</con:CostPrice>
//                                         <con:Description>Pregos</con:Description>
//                                         <con:LineType>Item</con:LineType>
//                                         <con:Quantity>20</con:Quantity>
//                                         <con:Reference>PREG</con:Reference>
//                                         <con:Unit>NXTWY.UMT.3</con:Unit>
//                                       </con:LineQuestionExternalIntegrationCreate>
//                                     </vor:Items>
//                                   </vor:NewEntities>
//                                 </con:Lines>
//                                 <con:LotNumber>1</con:LotNumber>
//                                 <con:PriceListScreenConfiguration>BasePriceUNSPSCCfg</con:PriceListScreenConfiguration>
//                                 <con:QuestionType>PriceListQuestion</con:QuestionType>
//                                 <con:RequiresEvidence>false</con:RequiresEvidence>
//                               </con:QuestionExternalIntegrationCreate>
//                             </vor:Items>
//                           </vor:NewEntities>
//                         </con:Questions>
//                       </con:QuestionnaireExternalIntegrationCreate>
//                     </vor:Items>
//                   </vor:NewEntities>
//                 </con:Questionnaires>
//                 <con:SIIFIntegration>
//                   <con:BudgetOrigin>Royalties</con:BudgetOrigin>
//                   <con:ExpenseType>Investment</con:ExpenseType>
//                   <con:RegisteredInSIIF>true</con:RegisteredInSIIF>
//                 </con:SIIFIntegration>
//                 <con:Description>Descripción proceso de prueba</con:Description>
//                 <con:Evaluation>
//                   <con:DefineEvaluation>false</con:DefineEvaluation>
//                 </con:Evaluation>
//                 <con:Name>Connect_Name</con:Name>
