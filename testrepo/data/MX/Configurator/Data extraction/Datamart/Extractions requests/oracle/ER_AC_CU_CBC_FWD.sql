SELECT  
   DATA_DT,
   TRN_PRODUCT,
   DURATION,
   BUY_OS_LD,
   BUY_TRADE_TD,
   BUY_EXP_TD,
   BUY_OS_TD,
   SELL_OS_LD,
   SELL_TRADE_TD,
   SELL_EXP_TD,
   SELL_OS_TD,
   SYSTEM_DT
  FROM    V_AC_CU_CBC_FWD_REP TP
where  DATA_DT @I_DT:D
