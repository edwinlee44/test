SELECT  
M_EN_DATE,
M_ENTITY,
M_PRODUCT,
M_EN_ACCOUNT,
M_LABEL_GL,
M_OS_TYPE,
M_EN_CUR,
M_EN_AMTN
  FROM    V_AC_IR_REPO_OS_AC_REP TP
where M_ENTITY @I_ENTITY:C
   and M_EN_DATE @I_DT:D
