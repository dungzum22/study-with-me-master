package com.se4f7.prj301.service;

import javax.servlet.http.Part;

import com.se4f7.prj301.model.PaginationModel;
import com.se4f7.prj301.model.request.AdsModelRequest;
import com.se4f7.prj301.model.response.AdsModelResponse;

public interface AdsService {

	public boolean create(AdsModelRequest request, Part banner, String username);

	public boolean update(String id, AdsModelRequest request, Part file, String username);

	public boolean deleteById(String id);

	public AdsModelResponse getById(String id);

	public PaginationModel filter(String page, String size, String name);

}
