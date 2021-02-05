select *
  from v_ac_ir_trade_rep TR
where M_TP_ENTITY @I_ENTITY:C
   and DATA_DT @I_DT:D
   and FREQUENCY @I_FREQUENCY:C