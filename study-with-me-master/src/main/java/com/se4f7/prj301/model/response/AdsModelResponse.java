package com.se4f7.prj301.model.response;

import com.se4f7.prj301.enums.AdsEnum;
import com.se4f7.prj301.model.BaseModel;

public class AdsModelResponse extends BaseModel {

	private String images;
	private AdsEnum status;
	private String witdh;
	private String height;
	private String position;
	private String url;
	
	public AdsModelResponse() {
		super();
	}
	
	public AdsModelResponse(String images, AdsEnum status, String witdh, String height, String position, String url) {
		super();
		this.images = images;
		this.status = status;
		this.witdh = witdh;
		this.height = height;
		this.position = position;
		this.url = url;
	}
	public String getImages() {
		return images;
	}
	public void setImages(String images) {
		this.images = images;
	}
	public AdsEnum getStatus() {
		return status;
	}
	public void setStatus(AdsEnum status) {
		this.status = status;
	}
	public String getWitdh() {
		return witdh;
	}

	public void setWitdh(String witdh) {
		this.witdh = witdh;
	}
	public String getHeight() {
		return height;
	}
	public void setHeight(String height) {
		this.height = height;
	}
	public String getPosition() {
		return position;
	}
	public void setPosition(String position) {
		this.position = position;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	
	
	

}
