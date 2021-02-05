SELECT RPT_DT,
       BU,
       INSTRUMENT,
       TRADER_DAILY,
       B_DAILY,
       C_DAILY,
       DAILY_DIFF_B,
       DAILY_DIFF_C,
       TRADER_MONTHLY,
       B_MONTHLY,
       C_MONTHLY,
        MONTHLY_DIFF_B,
       MONTHLY_DIFF_C
FROM V_AC_IR_BOND_INT_CHK_REP
where    I_DT @I_DT:D
  and trim(I_BU) @I_BU:C
  --and  I_ENTITY @I_ENTITY:C