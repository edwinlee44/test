select 
T1.M_CMP_TYPO as TradeTypology,
T1.M_CNT_TYPO as ContractTypology ,
T1.M_CONTRACT as Contract,
T1.M_NB as Trade_Number,
T1.M_TP_BLEI as LegalEntityIdentifier,
T1.M_TP_CNTRP as Counterparty,
T1.M_TP_CNTRPID as CntrpyID ,
T1.M_TP_DTETRN as Tradedate,
T1.M_TP_PFOLIO as Portfolio,

(case when (T1.M_TP_RTFV0='V' ) then T1.M_TP_RTDCN02
     else case when (T1.M_TP_RTFV1='V' )  then T1.M_TP_RTDCN12
               else T1.M_TP_RTDCN02
          end
end)as COUPON_PER,

(case when (T1.M_TP_RTFV0='F' ) then T1. M_TP_RTMRTE0
     else case when (T1.M_TP_RTFV1='F' )  then T1. M_TP_RTMRTE1
               else 0
          end
end)as COUPON_RATE,

(case when (T1.M_TP_RTFV0='F' ) then LTRIM( SUBSTR( T1.M_TP_RTMCNV0, INSTR (T1.M_TP_RTMCNV0,' '),15))

     else case when (T1.M_TP_RTFV1='F' )  then LTRIM(SUBSTR( T1.M_TP_RTMCNV0, INSTR (T1.M_TP_RTMCNV1,' '),15))
               else ''
          end
end)as DAY_COUNT,

(case when (T1.M_TP_RTFV0='V' ) then T1.M_TP_RTMNDX0
     else case when (T1.M_TP_RTFV1='V' )  then T1.M_TP_RTMNDX1
               else ''
          end
end)as FLOAT_INDEX_PER,

(case when (T1.M_TP_RTFV0='V' ) then upper(T1.M_TP_RTMFRC0)
     else case when (T1.M_TP_RTFV1='V' )  then upper(T1.M_TP_RTMFRC1)
               else upper(T1.M_TP_RTMFRC0)
          end
end)as FLOAT_PAY_PER,

(case when (T1.M_TP_RTFV0='V' ) then T1.M_TP_RTFXC02
     else case when (T1.M_TP_RTFV1='V' )  then T1.M_TP_RTFXC12
               else 0
          end
end)as FLOAT_RATE,

(case when (T1.M_TP_RTFV0='V') and (T1.M_TP_RTFV1='V') then T1.M_TP_RTFXC12
     else 0
end)as FLOAT_RATE2,

(case when (T1.M_TP_RTFV0='V' ) then upper(T1.M_TP_RTMFRF0)
     else case when (T1.M_TP_RTFV1='V' )  then upper(T1.M_TP_RTMFRF1)
               else ''
          end
end)as FLOAT_RESET_FREQUENCY,

(case when (T1.M_TP_RTFV0='V') and (T1.M_TP_RTFV1='V') then T1.M_TP_RTMNDX1
     else ''
end)as FLOAT2_INDEX_PER,

(case when (T1.M_TP_RTFV0='V' ) then T1.M_TP_RTMMRG0
     else case when (T1.M_TP_RTFV1='V' )  then T1.M_TP_RTMMRG1
               else 0
          end
end)as SPREAD,


T1.M_TP_TRADER as Trader,
T1.M_TP_TYPO as TradeCategory ,
T1.M_TRN_FMLY as Family,
T1.M_TRN_GRP as Group_,
T1.M_TRN_GTYPE as GroupType,
T1.M_TRN_TYPE as Type_,
T2.M_REF_DATA as REF_DATA_TP,
T2.M_COLLATERAL as Collateral_Agreement_name,
T2.M_COLLATERA0 as Collateral_Agreement_type,
T2.M_COLLATERA1 as Collateral_Counterparty,
T2.M_COLLATERA2 as Collateral_Ctp_Indpt_Amnt,
T2.M_COLLATERA3 as Collateral_End_Date,
T2.M_COLLATERA4 as Collateral_Indpt_Amnt_Curr,
T2.M_COLLATERA5 as Collateral_ISIN,
T2.M_COLLATERA6 as Collateral_LEI ,
T2.M_COLLATERA7 as Collateral_MTM_Curr,
T2.M_COLLATERA8 as Collateral_MTM_Date,
T2.M_COLLATERA9 as Collateral_MTM_Value,
T2.M_COLLATER10 as Collateral_Notional,
T2.M_COLLATER11 as Collateral_Our_Indpt_Amnt,
T2.M_COLLATER12 as  Collateral_Party_ID,
T2.M_COLLATER13 as Collateral_Product_Class,
T2.M_COLLATER14  as Collateral_Start_Date,
T2.M_COLLATER15  as Collateral_TradeCategory,
T2.M_COLLATER16 as Collateral_Trade_Curr,
T2.M_COLLATER17 as Collateral_Trade_Curr2,
T2.M_COLLATER18 as Collateral_Trade_Date,
T2.M_COLLATER19 as Collateral_Trade_Group_ID ,
T2.M_COLLATER20 as Collateral_Trade_ID,
T2.M_ENGINEDATE as EngineDate,
T2.M__VCOLLATE0 as COLLATERAL_TRADE_ID_NUM,
T2.M__VCOLLATER as COLLATERAL_FEEDER,
T2.M_REF_DATA as REF_DATA_MLC,

(case 
when ((T2.M_COLLATERAL is NULL) and (T2.M_COLLATERA0 is NULL) ) or (T2.M__VCOLLATER='MX') then   'MX'
     else  'EXT'
end) SOURCE,

(case when ((T2.M_COLLATERA1 is NULL) and (T1.M_TP_CNTRP is not NULL))  then T1.M_TP_CNTRP
     else  case when ( (T1.M_TP_CNTRP is NULL) and (T2.M_COLLATERA1 is not NULL))  then T2.M_COLLATERA1
     else T1.M_TP_CNTRP
     end
end) as COUNTERPART,


(case when ((T2.M_COLLATERA1 is NULL) and (T1.M_CNT_TYPO is not NULL))  then T1.M_CNT_TYPO
     else  case when ( (T1.M_CNT_TYPO is NULL) and (T2.M_COLLATERA1 is not NULL) and (T2.M_COLLATER13 is not NULL) )  then T2.M_COLLATER13
     else T1.M_CNT_TYPO
     end
end) as CONTRACT_TYPOLOGY,


case when T2.M_COLLATER15 is NULL  then 'Uncollaterized'
     else T2.M_COLLATER15
end as  COLLATERIZED


from 

COL_MLC_TRIRESFB_REP T2  left   join  COL_TP_FB_REP T1
on   T1.M_NB = to_number(trim( T2.M__VCOLLATE0) )   and T1.M_REF_DATA =@MxDataSetKey:N and T1.M_REF_DATA =  T2.M_REF_DATA
where T2.M__VCOLLATER='MX' 
 
 


