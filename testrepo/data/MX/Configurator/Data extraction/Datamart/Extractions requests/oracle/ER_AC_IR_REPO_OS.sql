SELECT  
DATA_DT,
ENTITY,
BU,
DATA_TYPE,
TYPO,
ORIG_CONTRACT_NO,
CONTRACT_NO,
TRN_NB,
PAYOUT,
PORTFOLIO,
TRADE_DATE,
START_DATE,
MATURITY_DATE,
CURR,
CNTRP_CODE,
CNTRP_NAME,
ISIN_CODE,
NOMINAL_AMT,
RESIDUAL_VALUE,
REP_ACCT_SEC_S,
UNDERLY_BOND_TYPE,
HAIRCUTRATE,
RATE,
STARTAMOUNT,
END_AMOUNT,
INTEREST_AMOUNT,
RATE_CONVENTION,
BOND_ISSUER,
ISSUER_LOCALE,
MODIFY_DT 
  FROM    V_AC_IR_REPO_OS_REP TP
where ENTITY @I_ENTITY:C
   and DATA_DT @I_DT:D
