package com.se4f7.prj301.service.impl;

import javax.servlet.http.Part;

import com.se4f7.prj301.constants.ErrorMessage;
import com.se4f7.prj301.model.PaginationModel;
import com.se4f7.prj301.model.request.AdsModelRequest;
import com.se4f7.prj301.model.response.AdsModelResponse;
import com.se4f7.prj301.repository.AdsRepository;
import com.se4f7.prj301.service.AdsService;
import com.se4f7.prj301.utils.FileUtil;
import com.se4f7.prj301.utils.StringUtil;

public class AdsServiceImpl implements AdsService {

	private AdsRepository AdsRepository = new AdsRepository();

	@Override
	public boolean create(AdsModelRequest request, Part banner, String username) {
		// Validate title is exists.
		AdsModelResponse oldAds = AdsRepository.getByPosition(request.getPosition());
		if (oldAds != null) {
			throw new RuntimeException(ErrorMessage.NAME_IS_EXISTS);
		}
		// Saving file from request.
		if (banner != null && banner.getSubmittedFileName() != null) {
			// Call function save file and return file name.
			String fileName = FileUtil.saveFile(banner);
			// Set filename saved to Model.
			request.setImages(username);
		}
		// Call repository saving file.
		return AdsRepository.create(request, username);
	}

	@Override
	public boolean update(String id, AdsModelRequest request, Part banner, String username) {
		// Parse String to Long.
		Long idNumber = StringUtil.parseLong("Id", id);
		// Get old Ads.
		AdsModelResponse oldAds = AdsRepository.getById(idNumber);
		// If Ads is not exists cannot update so will throw Error.
		if (oldAds == null) {
			throw new RuntimeException(ErrorMessage.RECORD_NOT_FOUND);
		}
		// Compare is title change.
		if (!request.getPosition().equalsIgnoreCase(oldAds.getPosition())) {
			// Compare new title with other name in database.
			AdsModelResponse otherAds = AdsRepository.getByPosition(request.getPosition());
			if (otherAds != null) {
				throw new RuntimeException(ErrorMessage.NAME_IS_EXISTS);
			}
		}
		// Saving file from request.
		if (banner != null && banner.getSubmittedFileName() != null) {
			// Delete old banner -> saving memory.
			FileUtil.removeFile(oldAds.getImages());
			// Call function save file and return file name.
			String fileName = FileUtil.saveFile(banner);
			// Set filename saved to Model.
			request.setImages(fileName);
		} else {
			// If banner not change we don't need replace it.
			// Re-use old name.
			request.setImages(oldAds.getImages());
		}
		// Call repository saving file.
		return AdsRepository.update(idNumber, request, username);
	}

	@Override
	public boolean deleteById(String id) {
		Long idNumber = StringUtil.parseLong("Id", id);
		AdsModelResponse oldAds = AdsRepository.getById(idNumber);
		if (oldAds == null) {
			throw new RuntimeException(ErrorMessage.RECORD_NOT_FOUND);
		}
		if (oldAds.getImages() != null) {
			// Delete old banner -> saving memory.
			FileUtil.removeFile(oldAds.getImages());
		}
		return AdsRepository.deleteById(idNumber);
	}

	@Override
	public AdsModelResponse getById(String id) {
		Long idNumber = StringUtil.parseLong("Id", id);
		AdsModelResponse oldAds = AdsRepository.getById(idNumber);
		if (oldAds == null) {
			throw new RuntimeException(ErrorMessage.RECORD_NOT_FOUND);
		}
		return oldAds;
	}

	@Override
	public PaginationModel filter(String page, String size, String name) {
		int pageNumber = StringUtil.parseInt("Page", page);
		int sizeNumber = StringUtil.parseInt("Size", size);
		return AdsRepository.filterByName(pageNumber, sizeNumber, name);
	}

}
