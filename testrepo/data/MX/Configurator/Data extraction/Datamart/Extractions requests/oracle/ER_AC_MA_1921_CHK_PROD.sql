SELECT  
DATA_DT,
BRANCH_GROUP,
CCY_TYPE_GROUP,
PROD_GROUP,
GL_CODE_GROUP,
ACC_NAME,
E,
I,
SUMMARY
  FROM    V_AC_MA_1921_CHK_PROD_REP   TP
where  DATA_DT  @I_DT:D
