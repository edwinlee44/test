select 
case H.M_ACTION when 'INSERT' then 'Insertion' when 'MODIFY' then 'Modification' when   'DELETE' then 'Deletion' end as ACTION, 
case ltrim(rtrim(H.M_TYPE))
when 'GRP' then 'General - Group Definition' 
when 'PS_DEF' then 'Workflows - Processing Script Def.'  
when 'PS_TMP' then 'Workflows - Processing Script Tmpl.'
when 'VAL_ACT' then 'Workflows - Validation Tmpl.'
when 'VAL_ACT_RL' then 'Workflows - Status Rules'
when 'STP_TMP' then 'Workflows - Validation queues Tmpl.'
when 'MARK_ACC' then 'Workflows - Market Prices Tmpl.'
when 'REP_TMP' then 'Rights - Reporting Templ.'
when 'ACC_MOD' then 'Rights - Acces on Module Tmpl.'
when 'CTP_CWT' then 'Rights - Counterpart chinese wall'
when 'NAV_RGT' then 'Rights - Navigation Tmpl.'
when 'TRD_RGTSTS' then 'Rights - Trade rights by status Tmpl.'
when 'HEDGE_EFF' then 'Rights - Pref. List Hedge Effetivness Tmpl.'
when 'STGY_CODE' then 'Rights - Pref. List Strategy Code Tmpl.'
when 'HRC_RGT' then 'Rights - Classification hierarchy Tmpl.'
when 'JOIN_RGT' then 'Rights - Classification join Tmpl.'
when 'DATA_CONS' then 'Consistency - Data consistency Tmpl.'
when 'DAT_PUB' then 'Interfaces - Data publisher Tmpl.'
when 'DAT_PUB_RL' then 'Interfaces - Data publisher Rules'
else ltrim(rtrim(H.M_TYPE)) end as AUDIT_MODULE,
H.M_REF as AUD_RECORD, 
H.M_CMP_DATE as AUDIT_DATE, 
H.M_CMP_TIME as AUDIT_TIME, 
H.M_USR_NAME as USER_LABEL, 
H.M_USR_GROUP as GROUP_LABEL, 
B.M_FLD_LABEL as AUDIT_ITEM, 
B.M_OLD_VALUE as OLD_VALUE, 
B.M_NEW_VALUE as NEW_VALUE
FROM AUD_CFGH_DBF H, AUD_CFGB_DBF B
WHERE H.M_ID (+)= B.M_ID and
H.M_SYS_DATE >= @FirstAuditDate:D and H.M_SYS_DATE <= @SecondAuditDate:D
order by ACTION, AUDIT_DATE, AUDIT_TIME, USER_LABEL, AUDIT_MODULE, AUD_RECORD, AUDIT_ITEM