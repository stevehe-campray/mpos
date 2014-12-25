package com.mpos.dto;

// Generated Dec 18, 2014 11:18:19 AM by Hibernate Tools 4.0.0

/**
 * MposProduct generated by hbm2java
 */
public class Tproduct implements java.io.Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer id;
	private String productName;
	private String shortDescr;
	private String fullDescr;
	private String unitName;
	private Float oldPrice;
	private float price;
	private Integer sku;
	private boolean recommend;
	private int sort;
	private boolean status;
	private Tmenu tmenu;
	private Tcategory tcategory;
	private String  menuname;
	private String  categoryname;

	public Tproduct() {
	}



	public Tproduct(Tmenu tmenu,  Tcategory tcategory, String productName,
			String shortDescr, String fullDescr, String unitName,
			Float oldPrice, float price, Integer sku, boolean recommend,
			int sort,boolean status) {
		this.tmenu = tmenu;
		this.tcategory = tcategory;
		this.productName = productName;
		this.shortDescr = shortDescr;
		this.fullDescr = fullDescr;
		this.unitName = unitName;
		this.oldPrice = oldPrice;
		this.price = price;
		this.sku = sku;
		this.recommend = recommend;
		this.sort = sort;
		this.status=status;
	}


	
	
	
	
	public String getMenuname() {
		return tmenu.getTitle();
	}



	public void setMenuname(String menuname) {
		this.menuname = menuname;
	}



	public String getCategoryname() {
		return tcategory.getName();
	}



	public void setCategoryname(String categoryname) {
		this.categoryname = categoryname;
	}



	public boolean isStatus() {
		return this.status;
	}



	public void setStatus(boolean status) {
		this.status = status;
	}



	public Tmenu getTmenu() {
		return this.tmenu;
	}

	public void setTmenu(Tmenu tmenu) {
		this.tmenu = tmenu;
	}

	public Tcategory getTcategory() {
		return this.tcategory;
	}

	public void setTcategory(Tcategory tcategory) {
		this.tcategory = tcategory;
	}

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getProductName() {
		return this.productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getShortDescr() {
		return this.shortDescr;
	}

	public void setShortDescr(String shortDescr) {
		this.shortDescr = shortDescr;
	}

	public String getFullDescr() {
		return this.fullDescr;
	}

	public void setFullDescr(String fullDescr) {
		this.fullDescr = fullDescr;
	}

	public String getUnitName() {
		return this.unitName;
	}

	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}

	public Float getOldPrice() {
		return this.oldPrice;
	}

	public void setOldPrice(Float oldPrice) {
		this.oldPrice = oldPrice;
	}

	public float getPrice() {
		return this.price;
	}

	public void setPrice(float price) {
		this.price = price;
	}

	public Integer getSku() {
		return this.sku;
	}

	public void setSku(Integer sku) {
		this.sku = sku;
	}

	public boolean isRecommend() {
		return this.recommend;
	}

	public void setRecommend(boolean recommend) {
		this.recommend = recommend;
	}

	public int getSort() {
		return this.sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

}
