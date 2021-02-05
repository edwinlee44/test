select
	FDR6C.M_CTP as Counterparty,--COL: Counterpart--
	FDR6C.M_LEGL_AGRMT as Agreement,--COL: Legal agreement--
	FDR6C.M_INS_DATE as Valuation_date,--COL: Insertion murex date --
	FDR6C.M_TYPE as Type_,--COL: Collateral exchange type--
	FDR6C.M_BASE_ID as ID,--COL: Collateral exchange origin ID--
	FDR6C.M_VERSION as Version,--COL: Collateral exchange version--
	FDR6C.M_REQ_TYPE as Requirement_type,--COL: Requirement type--
	case when FDR6C.M_COL_DIR = 'Return' then ''
	     when FDR6C.M_REQ_STAT = 'Partially Alloc' then 'Partially Allocated' else FDR6C.M_REQ_STAT end as Requirement_status,--COL: Requirement status --
	FDR6C.M_COL_DIR as Nature,--COL: Collateral nature--
	FDR6C.M_MOV_DIR as Direction,--COL: Movement direction
	FDR6C.M_ASSET_TYPE as Instrument_type,--COL: Asset type --
	FDR6C.M_INSTRUMENT as Instrument,--COL: Instrument --
	FDR6C.M_QUANTITY as Quantity,--COL: Quantity --
	FDR6C.M_FX_RATE as FX_rate,--COL: FX rate --
   FDR6C.M_PRICE as Price,--COL: Price --
	FDR6C.M_LOT_SIZE as Lot_size,--COL: Lot size --
	FDR6C.M_AS_COL_VAL as Collateral_value,--COL: Asset collateral value --
	FDR6C.M_HAIRCUT as Haircut, --COL: Haircut--
	FDR6C.M_VAL_DATE as Value_date, --COL: Valuation date --
   FDR6C.M_PORTFOLIO as Account, -- Account name
   --FDR6C.M_TTL_SUBVAL as TotSubtValue, -- Total substituted value
   FDR6C.M_CCY as ColExchCurrency, -- Collateral exchange currency
   FDR6C.M_SETTLEDATE as Settledate

from
	COL_EXC_ALLOC_FB_REP FDR6C,
	COL_PARTIES_FB_REP FDR3
where
	FDR6C.M_CTP = FDR3.M_CTP_LABEL and
	FDR6C.M_REF_DATA = FDR3.M_REF_DATA and
	(FDR6C.M_TYPE = 'Substitution' or
	FDR6C.M_TYPE = 'Requested substitution') and
	FDR6C.M_DSPT_STAT<>'Cancelled' and
	FDR6C.M_REF_DATA = @MxDataSetKey:N
UNION
select
	FDR6C.M_CTP as Counterparty,--COL: Counterpart--
	FDR6C.M_LEGL_AGRMT as Agreement,--COL: Legal agreement--
	FDR6C.M_INS_DATE as Valuation_date,--COL: Insertion murex date --
	FDR6C.M_TYPE as Type_,--COL: Collateral exchange type--
	FDR6C.M_BASE_ID as ID,--COL: Collateral exchange origin ID--
	FDR6C.M_VERSION as Version,--COL: Collateral exchange version--
	FDR6C.M_REQ_TYPE as Requirement_type,--COL: Requirement type--
	case when FDR6C.M_COL_DIR = 'Return' then '' 
	     when FDR6C.M_REQ_STAT = 'Partially Alloc' then 'Partially Allocated' else FDR6C.M_REQ_STAT end as Requirement_status,--COL: Requirement status --
	FDR6C.M_COL_DIR as Nature,--COL: Collateral nature--
	FDR6C.M_MOV_DIR as Direction,--COL: Movement direction
	FDR6C.M_ASSET_TYPE as Instrument_type,--COL: Asset type --
	FDR6C.M_INSTRUMENT as Instrument,--COL: Instrument --
	FDR6C.M_QUANTITY as Quantity,--COL: Quantity --
	FDR6C.M_FX_RATE as FX_rate,--COL: FX rate --
    FDR6C.M_PRICE as Price,--COL: Price --
	FDR6C.M_LOT_SIZE as Lot_size,--COL: Lot size --
	FDR6C.M_AS_COL_VAL as Collateral_value,--COL: Asset collateral value --
	FDR6C.M_HAIRCUT as Haircut, --COL: Haircut--
	FDR6C.M_VAL_DATE as Value_date, --COL: Valuation date --
   FDR6C.M_PORTFOLIO as Account, -- Account name
   --FDR6C.M_TTL_SUBVAL as TotSubtValue, -- Total substituted value
   FDR6C.M_CCY as ColExchCurrency, -- Collateral exchange currency
   FDR6C.M_SETTLEDATE as Settledate

from
	COL_EXC_MR_FB_REP FDR6C,
	COL_PARTIES_FB_REP FDR3
where
	FDR6C.M_CTP = FDR3.M_CTP_LABEL and
	FDR6C.M_REF_DATA = FDR3.M_REF_DATA and
	(FDR6C.M_TYPE = 'Substitution' or
	FDR6C.M_TYPE = 'Requested substitution') and
	FDR6C.M_REQ_STAT = 'NonAllocated   ' and
	FDR6C.M_DSPT_STAT<>'Cancelled' and
	FDR6C.M_REF_DATA = @MxDataSetKey:N