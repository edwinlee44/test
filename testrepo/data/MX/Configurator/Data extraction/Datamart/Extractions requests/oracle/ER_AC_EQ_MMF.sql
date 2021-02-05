SELECT  
  DATA_DT,           
  M_NB    ,          
  M_INSTRUMENT,      
  M_TP_PFOLIO,       
  BUYSELL,           
  M_TP_INT,          
  CURRENCY,          
  SB_QUANTITY,       
  S_B_CUMAMT_DEAL,   
  REALIZEDPL_ORIGIN, 
  ACCOUNTING_CCY,    
  REALIZEDPL,        
  TRADE_CATEGORY,    
  STRATEGY,          
  M_TP_ACCSCT,       
  UDF_PURPOS,        
  SECURITY_NM,       
  COUNTERPARTY,      
  CLEARING,          
  BROKER_FEE,        
  BROKER_TAX,        
  M_TP_ENTITY 
from V_AC_EQ_MMF_REP
where M_TP_ENTITY @I_ENTITY:C
   and DATA_DT @I_DT:D
