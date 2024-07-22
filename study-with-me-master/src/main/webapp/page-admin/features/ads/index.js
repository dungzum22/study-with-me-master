$(document).ready(function() {

	var $pagination = $('#AdsPagination');
	var inpSearchAdsName = '';
	// Init twbsPagination with defaultOpts /assets/global.settings.js)
	$pagination.twbsPagination(defaultOpts);

	// Listener event onChange when user typing on input search.
	this.onSearchByName = function() {
		// Get value from input search.
		inpSearchAdsName = $('#inpSearchAdsName').val();
		// Call function search filter value from input.
		this.getAds(0, defaultPageSize, inpSearchAdsName);
	}

	// Function search and pagination Ads. 
	this.getAds = function(page = 0, size = defaultPageSize, name = '') {
		// Use Ajax call API search Ads (/assets/http.js).
		Http.get(`${domain}/admin/api/Ads?type=filter&page=${page}&size=${size}&name=${name}`)
			.then(res => {
				let appendHTML = '';
				// Clear all elements in table content.
				$('#tblAds').empty();
				// Reset pagination.
				$pagination.twbsPagination('destroy');
				// Check api error or no data response.
				if (!res.success || res.data.totalRecord === 0) {
					// Append text No Data when records empty;
					$('#tblAds').append(`<tr><td colspan='9' style='text-align: center;'>No Data</td></tr>`);
					// End function.
					return;
				}

				// Build table content from data responses.
				for (const record of res.data.records) {
					appendHTML += '<tr>';
					appendHTML += `<td>${record.id}</td>`;
					appendHTML += `<td>${record.title}</td>`;
					appendHTML += `<td>${record.categoryName}</td>`;
					appendHTML += `<td>${record.banner}</td>`;
					appendHTML +=
						`<td>
						<span class='badge ${record.status.toLocaleLowerCase() === 'active' ? 'bg-success' : 'bg-danger'}'>
							${record.status}
						</span>
					</td>`;
					appendHTML += `<td>${record.createdBy}</td>`;
					appendHTML += `<td>${record.createdDate}</td>`;
					appendHTML += `<td>${record.updatedBy}</td>`;
					appendHTML += `<td>${record.updatedDate}</td>`;

					// Append action button Edit & Delete.
					appendHTML +=
						`<td class='text-right'>
							<a class='btn btn-info btn-sm' onclick='swicthViewAds(false, ${record.id})'>
								<i class='fas fa-pencil-alt'></i>
							</a>
							<a class='btn btn-danger btn-sm' onclick='deleteAds(${record.id})'>
								<i class='fas fa-trash'></i>
							</a>
						</td>`;
					appendHTML += '</tr>';
				}

				// Build pagination with twbsPagination.
				// More detail: https://josecebe.github.io/twbs-pagination/
				$pagination.twbsPagination($.extend({}, defaultOpts, {
					startPage: res.data.page + 1,
					totalPages: Math.ceil(res.data.totalRecord / res.data.size)
				}));
				// Add event listener when page change.
				$pagination
					.on('page', (event, num) => {
						this.getAds(num - 1, defaultPageSize, inpSearchAdsName);
					});

				// Append html table into tBody.
				$('#tblAds').append(appendHTML);
			})
			.catch(err => {
				toastr.error(err.errMsg);
			})
	}

	// Function delete Ads by id.
	this.deleteAds = function(id) {
		// Use Ajax call API get Ads by id (/assets/http.js).
		Http.delete(`${domain}/admin/api/Ads?id=${id}`)
			.then(res => {
				if (res.success) {
					this.swicthViewAds(true);
					toastr.success('Delete Ads success !')
				} else {
					toastr.error(res.errMsg);
				}
			})
			.catch(err => {
				toastr.error(err.errMsg);
			})
	}

	// Call API get Ads by id.
	this.getAdsById = function(id) {
		// Use Ajax call API get Ads by id (/assets/http.js).
		Http.get(`${domain}/admin/api/Ads?type=getOne&id=${id}`)
			.then(res => {
				if (res.success) {
					// Set value from response on update form.
					$('#inpAdsId').val(id);
					$('#inpAdsBanner').val(null);
					$('#inpAdsTitle').val(res.data.title);
					// Set value for box selects category.
					// More detail: https://select2.org/programmatic-control/add-select-clear-items			
					if ($('#selAdsCategory').find("option[value='" + res.data.categoryId + "']").length) {
						$('#selAdsCategory').val(res.data.categoryId).trigger('change');
					} else {
						// Create a DOM Option and pre-select by default
						var newOption = new Option(res.data.categoryName, res.data.categoryId, true, true);
						// Append it to the select
						$('#selAdsCategory').append(newOption).trigger('change');
					}
					// Set value for textarea Content.
					// More detail: https://summernote.org/getting-started/#get--set-code
					$('#inpPostContent').summernote('code', res.data.content);
				} else {
					toastr.error(res.errMsg);
				}
			})
			.catch(err => {
				toastr.error(err.errMsg);
			})
	}

	// Function create/edit Ads.
	this.saveAds = function() {
		const currentId = $('#inpAdsId').val();
		// Get value from input and build a JSON Payload.
		const payload = {
			'title': $('#inpAdsTitle').val(),
			'categoryId': $('#selAdsCategory').val(),
			'content': $('#inpPostContent').summernote('code')
		}
		// Create FormData and append files & JSON stringify.
		// More detail: https://viblo.asia/p/upload-file-ajax-voi-formdata-LzD5dL2e5jY
		// More detail with Postman: https://stackoverflow.com/questions/16015548/how-to-send-multipart-form-data-request-using-postman
		var formData = new FormData();
		// Append file selected from input.
		if ($('#inpAdsBanner')[0]) {
			formData.append('banner', $('#inpAdsBanner')[0].files[0]);
		}
		// Append payload Ads info.
		formData.append('payload', JSON.stringify(payload));
		if (currentId) {
			// Read detail additional function putFormData in file: /assets/http.js
			Http.putFormData(`${domain}/admin/api/Ads?id=${currentId}`, formData)
				.then(res => {
					if (res.success) {
						this.swicthViewAds(true);
						toastr.success(`Update Ads success !`)
					} else {
						toastr.error(res.errMsg);
					}
				})
				.catch(err => {
					toastr.error(err.errMsg);
				});
		} else {
			// Read detail additional function postFormData in file: /assets/http.js
			Http.postFormData(`${domain}/admin/api/Ads`, formData)
				.then(res => {
					if (res.success) {
						this.swicthViewAds(true);
						toastr.success(`Create Ads success !`)
					} else {
						toastr.error(res.errMsg);
					}
				})
				.catch(err => {
					toastr.error(err.errMsg);
				});
		}
	};
	// TODO: Handle after.
	this.draftAds = function() {
		alert("Làm biếng chưa có code");
	}
	// Using select2 query data categories.
	// More detail: https://select2.org/data-sources/ajax
	this.initSelect2Category = function() {
		// Init value for select2 on id #selAdsCategory.
		$('#selAdsCategory').select2({
			theme: 'bootstrap4',
			// Call api search category with select2.
			ajax: {
				url: `${domain}/admin/api/category`,
				headers: {
					// Get token from localStore and append on API.
					// Read more function: /assets/http.js
					'Authorization': 'Bearer ' + Http.getToken(),
					'Content-Type': 'application/json',
				},
				data: function(params) {
					var query = {
						type: 'filter',
						page: 0,
						size: 10,
						// params.term is value input on select2.
						name: params.term
					}
					// Query parameters will be ?type=[type]&page=[page]&size=[size]&name=[params.term]
					return query;
				},
				// Transform the data returned by your API into the format expected by Select2
				// Default format when use select2 is [{id: [id], text: [text]}]
				// So we need convert data from response to format of select2.
				processResults: function(res) {
					return {
						// Why we need using function [map] ?
						// Read more: https://viblo.asia/p/su-dung-map-filter-va-reduce-trong-javascript-YWOZrxm75Q0 
						results: res.data.records.map(elm => {
							return {
								id: elm.id,
								text: elm.name
							}
						})
					};
				}
			}
		});
	}

	// Action change display screen between Table and Form Create/Edit.
	this.swicthViewAds = function(isViewTable, id = null) {
		if (isViewTable) {
			$('#Ads-table').css('display', 'block');
			$('#Ads-form').css('display', 'none');
			this.getAds(0, defaultPageSize);
		} else {
			// Init summernote (Text Editor).
			$('#inpPostContent').summernote({ height: 150 });
			// Init select2 (Support select & search value).
			this.initSelect2Category();
			$('#Ads-table').css('display', 'none');
			$('#Ads-form').css('display', 'block');
			if (id == null) {
				$('#inpAdsTitle').val(null);
				$('#selAdsCategory').val(null);
				$('#inpAdsBanner').val(null);
				$('#inpPostContent').summernote('code', '');
			} else {
				this.getAdsById(id);
			}
		}
	};

	// Fix issues Bootstrap 4 not show file name.
	// More detail: https://stackoverflow.com/questions/48613992/bootstrap-4-file-input-doesnt-show-the-file-name
	$('#inpAdsBanner').change(function(e) {
		if (e.target.files.length) {
			// Replace the "Choose a file" label
			$(this).next('.custom-file-label').html(e.target.files[0].name);
		}
	});

	// Set default view mode is table.
	this.swicthViewAds(true);

});