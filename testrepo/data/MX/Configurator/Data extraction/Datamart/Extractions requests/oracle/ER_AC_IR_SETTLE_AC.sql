SELECT 
DATA_DT,
ENTITY,
PRODUCT,
ACCOUNT_TYPE,
ACCOUNT_CODE,
ACCOUNT_CODE_GL,
BAL_CCY,
BAL_AMT
  FROM    V_AC_IR_SETTLE_AC_REP TP
where ENTITY @I_ENTITY:C
   and DATA_DT @I_DT:D
