SELECT TRN_BCOMMENT0, 
                M_CRT_BND12, 
                M_TP_ENTITY, 
                IN_EXP,            
                M_TP_ACCSCT, 
                M_NB, 
                M_TP_NOMCUR, 
                M_TP_NOMINAL, 
                M_EN_CCY, 
                M_EN_AMT              
  FROM    V_AC_IR_HEDGE_INT_REP  TP
where I_ENTITY @I_ENTITY:C
   and I_DATE @I_DT:D
