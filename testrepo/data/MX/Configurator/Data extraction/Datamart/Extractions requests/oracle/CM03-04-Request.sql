select
INV.M_DATE2 as DATE2,
INV.M_AGREEMENT	as ColAgreeCur,
INV.M_CLOSING	as Closing,
INV.M_CLOSINGMV	as ClosingMV,
INV.M_CLOSINGV1	as ClosingValue,
INV.M_CLOSINGVA	as ClosingValueSec,
INV.M_COLLATER1	as ColTypology,
INV.M_COLLATERA	as ColAgreement,
INV.M_FAMILYLAB	as PLInstFamilyLbl,
INV.M_FXRATE	as FxRate,
INV.M_HAIRCUT	as Haircut,
INV.M_INSTCURRE	as InstCurrency,
INV.M_INSTRUMEN	as InstDispLabel,
INV.M_INTERNALA	as InternalAccount,
INV.M_ITEMNATUR	as ItemNature,
INV.M_LOTSIZE	as LotSize,
INV.M_PARTYNAME	as PartyName,
case
 when INV.M_POSITIONS = 'Theoretica' then 'Theoretical' 
 else INV.M_POSITIONS
end	as PositionSource,
case
 when INV.M_POSITIONT = 'Held_InTra' then 'Held in Transit'
 when INV.M_POSITIONT = 'Pledged_In' then 'Pledged in Transit'
 else  INV.M_POSITIONT
end as PositionType,
INV.M_PRICE	    as Price,
INV.M_PRICECURR	as PriceCurrency,
INV.M_SECAREADE	as SecAreaDefinition,
INV.M_SECCATEGO	as SecCategoryx,
INV.M_SECCURREN	as SecCurrency,
INV.M_SECISIN	as SecISIN,
INV.M_SECISSUE1	as SecIssuerCtry,
INV.M_SECISSUE2	as SecIssuerSector,
INV.M_SECISSUER	as SecIssuer,
INV.M_SECLABEL	as SecLabel,
INV.M_SECMATURI	as SecMaturity,
INV.M_SECSECTOR	as SecSector,
INV.M_SECSENIOR	as SecSeniority,
INV.M_SECCOUNTR as SecCountry,
INV.M_SECTYPE	as SecType,
case
	when AST.M_QUOT_MOD = 0 then 'Bid'
	else 'Mid' end as QuoteMode,
NVL(SEC.M_SE_GROUP,'NotSet')  as SecGoup,
NVL(SEC.M_SE_CATE,'NotSet')   as SecCategory, 
NVL(SEC.M_SE_MARKET,'NotSet') as SecMarket,
NVL(CUR.M_CUR_CAT,'NotSet')  as CurCategory,
NVL(PRTY.M_ISS_CAT,'NotSet') as IssuerCategory,
NVL(SEC.M_BOND_TYPE,'NotSet') as SecBondType,
INV.M_REF_DATA	as M_REF_DATA

from COL_INVENTORY_FB_REP INV 
left join COL_ASSET_COL_FB_REP  AST    on (INV.M_COLLATERA = AST.M_LABEL and INV.M_REF_DATA = AST.M_REF_DATA)
left join COL_SEC_FB_REP  SEC    on (INV.M_SECLABEL  = SEC.M_SE_LABEL and INV.M_REF_DATA = SEC.M_REF_DATA)
left join COL_CURR_FB_REP		 		  CUR    on ((INV.M_SECCURREN = CUR.M_SEC_CUR or INV.M_INSTCURRE = CUR.M_SEC_CUR) and INV.M_REF_DATA = CUR.M_REF_DATA)
left join COL_PARTIES_FB_REP        PRTY  on (INV.M_SECISSUER = PRTY.M_CTP_LABEL  and INV.M_REF_DATA = PRTY.M_REF_DATA)
where M_CLOSING <> 0 and INV.M_REF_DATA=@MxDataSetKey:N