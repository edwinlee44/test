SELECT 
 DATA_DT,
 DATA_TYPE,
 M_NB,
 M_TP_PFOLIO,
 PL,
 PL_CCY,
 PL_LOCALE,
 PL_LOCALE_CCY,
 PL_LOCALE_RT,
 PL_LOGIC,
 TRN_PRODUCT,
 M_CMP_TYPO,
 M_CONTRACT,
 M_INSTRUMENT,
 M_PACKAGE,
 M_PL_FE2,
 M_SC2_CUR_UC,
 M_TP_ACCSCT,
 M_TP_STRTGY,
 M_TP_TYPO,
 M_TRN_FMLY,
 M_TRN_GRP,
 M_TRN_TYPE,
 DATA_COMMENT,
 PL_LOCALE_PVE,
 PL_LOCALE_TAX,
 PL_LOCALE_FEE,
 PL_LOCALE_OCI,
 PL_LOCALE_OCI_RJE,
 PL_LOCALE_TDA,
 M_MRPL_DATE,
 TRN_STATUS,
 M_MOD_REASON, 
 BOND_COMP_1,
 BOND_COMP_2,
BOND_COMP_3,
BOND_COMP_4,
BOND_COMP_5,
BOND_COMP_6,
BOND_COMP_7,
BOND_COMP_8,
BOND_COMP_9
  FROM mxrep_prod.DM_AC_MA_PL_DTL
 WHERE  M_TRN_FMLY = 'CURR'
   AND ((M_TRN_GRP = 'FUT'   AND M_TRN_TYPE = 'FUT') 
     OR (M_TRN_GRP = 'OPT'   AND M_TRN_TYPE = 'LST'))
   --AND M_TP_PFOLIO LIKE 'CYFO%'
   
   
   
   
   union

 select 
 DATA_DT,
 DATA_TYPE,
 M_NB,
 dtl.M_TP_PFOLIO,
 PL,
 PL_CCY,
 PL_LOCALE,
 PL_LOCALE_CCY,
 PL_LOCALE_RT,
 PL_LOGIC,
 TRN_PRODUCT,
 M_CMP_TYPO,
 M_CONTRACT,
 M_INSTRUMENT,
 M_PACKAGE,
 M_PL_FE2,
 M_SC2_CUR_UC,
 M_TP_ACCSCT,
 M_TP_STRTGY,
 M_TP_TYPO,
 M_TRN_FMLY,
 M_TRN_GRP,
 M_TRN_TYPE,
 DATA_COMMENT,
 PL_LOCALE_PVE,
 PL_LOCALE_TAX,
 PL_LOCALE_FEE,
 PL_LOCALE_OCI,
 PL_LOCALE_OCI_RJE,
 PL_LOCALE_TDA,
 M_MRPL_DATE,
 TRN_STATUS,
 M_MOD_REASON, 
 BOND_COMP_1,
 BOND_COMP_2,
BOND_COMP_3,
BOND_COMP_4,
BOND_COMP_5,
BOND_COMP_6,
BOND_COMP_7,
BOND_COMP_8,
BOND_COMP_9
 
  from mxrep_prod.DM_AC_MA_PL_DTL  dtl
 INNER JOIN ( select distinct( M_TP_PFOLIO ) from mxrep_prod.DM_AC_MA_PL_DTL 
 WHERE  (M_TRN_FMLY = 'CURR'
   AND ((M_TRN_GRP = 'FUT'   AND M_TRN_TYPE = 'FUT') 
     OR (M_TRN_GRP = 'OPT'   AND M_TRN_TYPE = 'LST'))) ) pfo on dtl.m_tp_pfolio = pfo.m_tp_pfolio
 
 where  (dtl.M_TRN_FMLY = 'SCF' AND dtl.M_TRN_GRP = 'SCF'   AND dtl.M_TRN_TYPE = 'SCF' AND dtl.M_TP_TYPO = 'FEE SELL DOWN' )
 