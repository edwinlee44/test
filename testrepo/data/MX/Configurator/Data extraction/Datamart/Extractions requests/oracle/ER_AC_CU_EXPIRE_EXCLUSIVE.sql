SELECT
       *
  FROM    v_ac_cu_expire_exclusive_rep TP
where to_date(DATA_DT,'YYYYMMDD') @I_DT:D
   and ENTITY @I_ENTITY:C