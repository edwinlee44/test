SELECT  
BU_DESC,
ACC_CODE,
ENTRY_DATE,
ENTITY,
CCY,
AMOUNT,
PROD,
TYPE,
BOND_TYPE,
TYPOLOGY,
BUY_SELL,
PORTFOLIO,
NB,
CURR,
SECURITY_CODE,
ISIN_CODE,
MOP_TYPE
  FROM    V_AC_IR_BOND_GAINLOSS_REP  TP
where ENTITY @I_ENTITY:C
   and ENTRY_DATE  @I_DT:D
