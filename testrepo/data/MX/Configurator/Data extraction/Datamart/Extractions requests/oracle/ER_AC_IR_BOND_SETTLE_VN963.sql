SELECT 
       DATA_DT,    
       M_TP_ENTITY, 
       TRN_BU,     
       TRN_PRODUCT, 
       M_TP_ACCSCT,
       M_NB,           
       M_TP_TYPO,       
       M_TP_PFOLIO,    
       TRN_BS_FLAG,    
       SETTLE_TYPE,    
       TRN_TRADE_DT,   
       SETTLE_DT,       
       TRN_START_DT,   
       TRN_EXPIRE_DT,   
       CNTRP_CD,       
       CNTRP_BNK_FLAG, 
       CNTRP_LOCALE,    
       ISSUER_NM,       
       ISSUER_CNTRY_CD, 
       CNTRP_HOMECNTRY,
       SETTLE_AMT_CCY,  
       SETTLE_AMT,      
       TRN_PAY_INIT_FLAG
  FROM V_AC_IR_BOND_SETTLE_REP
  where SUBSTR(M_TP_ENTITY,1,7) @I_ENTITY:C
   and DATA_DT @I_DT:D