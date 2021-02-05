SELECT
	FDR6.M_CTP, --COL: Counterpart--
	FDR6.M_LEGL_AGRMT, --COL: Legal agreement--
	FDR6.M_TYPE, --COL: Collateral exchange type--
	FDR6.M_BASE_ID, --COL: Collateral exchange origin ID--
	FDR6.M_VERSION, --COL: Collateral exchange version--
	FDR6.M_REQ_TYPE, --COL: Requirement type--
	FDR6.M_MOV_DIR, --COL: Movement direction--	
	FDR6.M_COL_DIR, --COL: Collateral nature--
	FDR6.M_REQ_CCY, --COL: Requirement currency--	
	FDR6.M_OUR_AMNT, --COL: Our calculated amount--
	FDR6.M_CTP_AMNT, --COL: Requirement amount from counterpart's view--
	FDR6.M_AMNT_AGRED, --COL: Agreed amount--
    FDR6.M_DSPT_STAT,  --COL: Dispute event status--
	FDR6.M_H_DAY_PNDG, --Pending for (days)--
   FDR6.M_VAL_DATE
from
	COL_EXC_MRDP_FB_REP FDR6,
    COL_PARTIES_FB_REP FDR3
where
    FDR6.M_CTP = FDR3.M_CTP_LABEL
and
	FDR6.M_REF_DATA = FDR3.M_REF_DATA
and
	(FDR6.M_TYPE = 'Margin call' or FDR6.M_TYPE = 'Expected margin call') 
and
	FDR6.M_DSPT_STAT<>' '
and 
   FDR6.M_REF_DATA = @MxDataSetKey:N