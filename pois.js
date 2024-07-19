const iconSettings = {
    0: 'icons/map_town.svg',
    1: 'icons/map_town.svg',
    2: 'icons/alt_landable_airport.svg',
    3: 'icons/alt_landable_field.svg',
    4: 'icons/alt_gliding_airport.svg',
    5: 'icons/alt_reachable_airport.svg',
    6: 'icons/map_pass.svg',
    7: 'icons/map_mountain_top.svg',
    8: 'icons/map_obstacle.svg',
    9: 'icons/map_vor.svg',
    10: 'icons/map_ndb.svg',
    11: 'icons/map_tower.svg',
    12: 'icons/map_dam.svg',
    13: 'icons/map_tunnel.svg',
    14: 'icons/map_bridge.svg',
    15: 'icons/map_power_plant.svg',
    16: 'icons/map_castle.svg',
    17: 'icons/map_intersection.svg'
};

// Add the mapping as a constant
const styleMapping = {
    0: "Unknown",
    1: "Waypoint",
    2: "Airfield with a grass/dirt runway",
    3: "Outlanding/field",
    4: "Gliding airfield",
    5: "Airfield with a paved runway",
    6: "Mountain Pass",
    7: "Mountain Top",
    8: "Transmitter Mast",
    9: "VOR",
    10: "NDB",
    11: "Cooling Tower",
    12: "Dam",
    13: "Tunnel",
    14: "Bridge",
    15: "Power Plant",
    16: "Castle",
    17: "Intersection"
};





const ICON_SIZES = {
    0: [6, 6],   // Icon size at zoom level 0
    1: [6, 6],   // Icon size at zoom level 1
    2: [7, 7],   // Icon size at zoom level 2
    3: [8, 8],   // Icon size at zoom level 3
    4: [8, 8],   // Icon size at zoom level 4
    5: [8, 8],   // Icon size at zoom level 5
    6: [9, 9],   // Icon size at zoom level 6
    7: [9, 9],   // Icon size at zoom level 7
    8: [10, 10],   // Icon size at zoom level 8
    9: [10, 10],   // Icon size at zoom level 9
    10: [14, 14], // Icon size at zoom level 10 and above
    11: [16, 16],
    12: [20, 20],
    13: [20, 20],
    14: [20, 20],
    15: [20, 20],
    16: [20, 20],
    17: [20, 20],
    18: [20, 20],
    19: [20, 20],
    20: [20, 20],
    21: [20, 20],
    22: [20, 20]
};

const TEXT_SIZES = {
    0: { size: '4px', visible: false },
    1: { size: '4px', visible: false },
    2: { size: '4px', visible: false },
    3: { size: '4px', visible: false },
    4: { size: '4px', visible: false },
    5: { size: '4px', visible: false },
    6: { size: '4px', visible: false },
    7: { size: '8px', visible: false },
    8: { size: '8px', visible: false },
    9: { size: '10px', visible: true },
    10: { size: '10px', visible: true },
    11: { size: '10px', visible: true },
    12: { size: '12px', visible: true },
    13: { size: '12px', visible: true },
    14: { size: '12px', visible: true },
    15: { size: '12px', visible: true },
    16: { size: '12px', visible: true },
    17: { size: '12px', visible: true },
    18: { size: '12px', visible: true }
};

function convertDMSToDD(dms) {
    const degreesPart = dms.substring(0, dms.length - 7);
    const degrees = parseInt(degreesPart);
    const minutes = parseFloat(dms.substring(dms.length - 7, dms.length - 1));
    const direction = dms.charAt(dms.length - 1);
    let dd = Math.abs(degrees) + (minutes / 60);
    if (direction === 'S' || direction === 'W' || degreesPart.startsWith('-')) {
        dd = -dd;
    }
    return dd;
}

function metersToFeet(meters) {
    const feet = Math.round(meters * 3.28084) + ' ft';
    console.log(`Converting ${meters} meters to ${feet}`);
    return feet;
}

function feetToMeters(feet) {
    const meters = Math.round(feet / 3.28084) + ' m';
    console.log(`Converting ${feet} feet to ${meters}`);
    return meters;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    const R = 3958.8; // Radius of the Earth in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}






document.addEventListener('DOMContentLoaded', function () {
    // Set the initial view to zoom level 5 and center at lat 38, lon -96
	const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	});

	const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri',
		maxZoom: 19
	});


	const thunderforestLandscape = L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=d733519551fd447989259b4a961fb864', {
		attribution: '© <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		maxZoom: 22
	});


    const map = L.map('map', {
        center: [38, -96],
        zoom: 5,
        layers: [satellite], // Default layer
		zoomControl: false // Disable the default zoom control
    });

    const baseMaps = {
        "Street Map": streets,
        "Satellite": satellite,
        "Landscape": thunderforestLandscape
    };

    // Add this new code for the image age control
	L.Control.ImageAge = L.Control.extend({
		onAdd: function(map) {
			this._container = L.DomUtil.create('div', 'image-age-container');
			this._text = L.DomUtil.create('span', '', this._container);
			this._map = map;
			this._currentDate = ''; // Store the current date for updates

			map.on('zoomend', this._onZoomChange, this); // Listen for zoom changes
			map.on('baselayerchange', this._onBaseLayerChange, this); // Listen for basemap changes

			this._onZoomChange(); // Set initial state
			return this._container;
		},

		_onZoomChange: function() {
			var zoom = this._map.getZoom();
			if (zoom >= 12) {
				this._getImageInfo(); // Update image info on zoom change
			} else {
				this._text.innerHTML = 'Zoom in for image date';
			}
		},

		_getImageInfo: function() {
			var center = this._map.getCenter();
			var url = `https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/identify`;

			var params = {
				f: 'json',
				geometry: `${center.lng},${center.lat}`,
				geometryType: 'esriGeometryPoint',
				sr: 4326,
				tolerance: 0,
				mapExtent: this._map.getBounds().toBBoxString(),
				imageDisplay: `${this._map.getSize().x},${this._map.getSize().y},96`,
				returnGeometry: false,
				returnCatalogItems: 'true',
				returnZ: 'true'
			};

			fetch(`${url}?${new URLSearchParams(params).toString()}`)
				.then(response => response.json())
				.then(data => {
					console.log('Full API response:', data);
					if (data.results && data.results.length > 0) {
						var attributes = data.results[0].attributes;
						var srcDate = attributes['SRC_DATE2'];
						if (srcDate) {
							this._text.innerHTML = `Image Date: ${srcDate}`;
						} else {
							this._text.innerHTML = 'Image Date: N/A';
						}
					} else {
						this._text.innerHTML = 'Image Date: N/A';
					}
				})
				.catch(error => {
					console.error('Error fetching image metadata:', error);
					this._text.innerHTML = 'Image Date: Error';
				});
		},

		_onBaseLayerChange: function(e) {
			if (e.name === "Satellite") {
				this._container.style.display = 'block';
				this._onZoomChange(); // Update date info when switching to Satellite
			} else {
				this._container.style.display = 'none';
			}
		}
	});

	new L.Control.ImageAge({ position: 'bottomright' }).addTo(map);




	// Add baseMaps to the map with the control layer
	L.control.layers(baseMaps).addTo(map);

	L.control.zoom({
		position: 'topright' // Change the position of the zoom control
	}).addTo(map);

    let markers = []; // Store marker references for updating on zoom change
    let currentPoi = null; // Store the currently displayed POI details
    let lastPoi = null; // Variable to store the last processed POI
	
    /**
     * Extracts approximate coordinates from lat/lon strings
     * @param {string} lat - Latitude in DMS format
     * @param {string} lon - Longitude in DMS format
     * @returns {Array} - Array with approximate [latitude, longitude]
     */
    function getApproximateCoordinates(lat, lon) {
        console.log('Getting approximate coordinates for', lat, lon);
        const latDD = convertDMSToDD(lat);
        const lonDD = convertDMSToDD(lon);
        
        const approxLat = Math.trunc(latDD);
        const approxLon = Math.trunc(lonDD);
        
        console.log('Approximate coordinates:', approxLat, approxLon);
        return [approxLat, approxLon];
    }	
	
	

	
	
    // Add event listener to the "Upload CUP File" button
    const uploadButton = document.getElementById('upload-cup-button');
    const fileInput = document.getElementById('cup-file-input');

    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });


    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = e.target.result;
                console.log('File content loaded, length:', data.length);
                const pois = parseCUPData(data);
                console.log('Parsed POIs:', pois.length);

                clearMarkers(); // Clear existing markers before adding new ones
                console.log('Existing markers cleared');

                pois.forEach((poi, index) => {
                    try {
                        const lat = convertDMSToDD(poi.lat);
                        const lon = convertDMSToDD(poi.lon);
                        console.log(`Creating marker ${index + 1}/${pois.length} for ${poi.name} at (${lat}, ${lon})`);
                        createMarker(poi, lat, lon);
                        lastPoi = poi; // Update lastPoi with each iteration
                    } catch (error) {
                        console.error(`Error creating marker for ${poi.name}:`, error);
                    }
                });

                console.log('All markers created. Total markers:', markers.length);
                updateVisibleWaypointsCount();
                
                // Recenter map to last POI's approximate location
                if (lastPoi) {
                    console.log('Recentering map to last POI:', lastPoi.name);
                    const [approxLat, approxLon] = getApproximateCoordinates(lastPoi.lat, lastPoi.lon);
                    console.log('Setting view to:', approxLat, approxLon, 'with zoom:', map.getZoom());
                    map.setView([approxLat, approxLon], map.getZoom());
                } else {
                    console.log('No POIs processed, map not recentered');
                }
            };
            reader.readAsText(file);
        } else {
            console.log('No file selected');
        }
    });
	
	function fitMapToMarkers() {
		if (markers.length > 0) {
			const group = new L.featureGroup(markers.map(m => m.marker));
			map.fitBounds(group.getBounds());
		}
	}	

    // Function to parse the CUP file
	function parseCUPData(data) {
		console.log('Parsing CUP data...');
		const lines = data.split('\n');
		const headers = lines[0].split(',');
		console.log('CUP headers:', headers);
		const pois = [];

		for (let i = 1; i < lines.length; i++) {
			const line = lines[i].trim();
			// Skip lines that do not match the expected CUP file format
			if (!line || !line.includes(',')) {
				console.log('Skipping invalid line:', line);
				continue;
			}
			const values = line.split(',').map(value => value.trim().replace(/^"|"$/g, ''));
			const poi = {};
			headers.forEach((header, index) => {
				poi[header.trim()] = values[index];
			});
			console.log('Parsed POI:', poi);
			pois.push(poi);
		}
		console.log('Total POIs parsed:', pois.length);
		return pois;
	}

    function clearMarkers() {
        markers.forEach(({ marker }) => {
            map.removeLayer(marker);
        });
        markers = [];
    }







	function updateAllMarkers() {
		markers.forEach(({ marker, poi }) => {
			const iconSize = ICON_SIZES[map.getZoom()] || ICON_SIZES[10]; // Default to size for zoom level 10 if undefined
			updateMarkerIcon(marker, poi, iconSize);
		});
	}


	map.on('zoomend', function() {
		console.log(`Zoom level changed: ${map.getZoom()}`);
		updateAllMarkers();
		handleAirspaceLabelsVisibility(map.getZoom());
		adjustCircles();
	});

	const visibleWaypointsSpan = document.getElementById('visible-waypoints');

	function updateVisibleWaypointsCount() {
		if (visibleWaypointsSpan) {
			visibleWaypointsSpan.textContent = `Number of waypoints: ${markers.length}`;
		} else {
			console.error('visible-waypoints element not found');
		}
	}








	
	let selectedPoi = null; // Track the currently selected POI


	function createMarker(poi, lat, lon) {
		console.log(`Creating marker for ${poi.name} at ${lat}, ${lon}`);
		const zoomLevel = map.getZoom();
		const iconSize = ICON_SIZES[zoomLevel] || ICON_SIZES[10];
		const iconUrl = iconSettings[poi.style] || 'icons/default_icon.svg';
		const textSize = TEXT_SIZES[zoomLevel].size;
		const textVisible = TEXT_SIZES[zoomLevel].visible ? 'visible' : 'hidden';

		const borderStyle = (selectedPoi && selectedPoi.name === poi.name) ? '2px solid red' : 'none';

		const customIcon = L.divIcon({
			html: `
				<div style="position: relative;">
					<img src="${iconUrl}" style="width: 100%; height: 100%; transform: rotate(${parseFloat(poi.rwdir) - 45}deg); transform-origin: center;">
					<div style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); border-radius: 5px; padding: 2px 5px; white-space: nowrap; text-align: center; font-size: ${textSize}; visibility: ${textVisible}; color: white; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; border: ${borderStyle}; border-radius: 5px;">
						${poi.name}
					</div>
				</div>
			`,
			className: '',
			iconSize: iconSize,
			iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
			popupAnchor: [0, -iconSize[1] / 2]
		});

		const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
		markers.push({ marker, poi });

		marker.on('click', () => {
			console.log('Marker clicked:', poi.name);
			selectedPoi = poi; // Update the selected POI
			updateAllMarkers(); // Update all markers to reflect the selection
			updatePoiDetails(poi);

		});
    }

	function updateMarkerIcon(marker, poi, iconSize) {
		const zoomLevel = map.getZoom();
		const iconUrl = iconSettings[poi.style] || 'icons/default_icon.svg';
		const textSize = TEXT_SIZES[zoomLevel].size;
		const textVisible = TEXT_SIZES[zoomLevel].visible ? 'visible' : 'hidden';

		const borderStyle = (selectedPoi && selectedPoi.name === poi.name) ? '2px solid red' : 'none';

		const customIcon = L.divIcon({
			html: `
				<div style="position: relative;">
					<img src="${iconUrl}" style="width: 100%; height: 100%; transform: rotate(${parseFloat(poi.rwdir) - 45}deg); transform-origin: center;">
					<div style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); border-radius: 5px; padding: 2px 5px; white-space: nowrap; text-align: center; font-size: ${textSize}; visibility: ${textVisible}; color: white; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; border: ${borderStyle}; border-radius: 5px;">
						${poi.name}
					</div>
				</div>
			`,
			className: '',
			iconSize: iconSize,
			iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
			popupAnchor: [0, -iconSize[1] / 2]
		});

        marker.setIcon(customIcon);
    }

	function updatePoiDetails(poi) {
		const unit = document.getElementById('units').value;
		console.log('Current unit:', unit);

		// Helper function to safely convert and format values
		function convertValue(value, unit, conversionFunc) {
			if (typeof value === 'string') {
				const numericValue = parseFloat(value);
				if (!isNaN(numericValue)) {
					if (value.endsWith('m') && unit === 'imperial') {
						return conversionFunc(numericValue) + ' ft';
					} else if (value.endsWith('ft') && unit === 'metric') {
						return conversionFunc(numericValue) + ' m';
					}
				}
			}
			return value || ''; // Return original value or empty string if undefined/invalid
		}

		// Convert values
		let elev = convertValue(poi.elev, unit, unit === 'imperial' ? metersToFeet : feetToMeters);
		let rwlen = convertValue(poi.rwlen, unit, unit === 'imperial' ? metersToFeet : feetToMeters);
		let rwwidth = convertValue(poi.rwwidth, unit, unit === 'imperial' ? metersToFeet : feetToMeters);

		console.log(`Displaying details for ${poi.name || 'Unknown'}:`, { elev, rwlen, rwwidth });

		// Helper function to safely update DOM elements
		function updateElement(id, value) {
			const element = document.getElementById(id);
			if (element) {
				element.textContent = value || '';
			} else {
				console.warn(`Element with id '${id}' not found`);
			}
		}

		// Update DOM elements
		updateElement('poi-name', poi.name);
		updateElement('poi-code', poi.code);
		updateElement('poi-country', poi.country);
		updateElement('poi-lat', poi.lat);
		updateElement('poi-lon', poi.lon);
		updateElement('poi-elev', elev);

		// Use the mapping to display the style
		const styleValue = poi.style || '';
		const styleDescription = styleMapping[styleValue] || "Unknown";
		updateElement('poi-style', `${styleValue} - ${styleDescription}`);

		updateElement('poi-rwdir', poi.rwdir ? `${poi.rwdir}°` : '');
		updateElement('poi-rwlen', rwlen);
		updateElement('poi-rwwidth', rwwidth);
		updateElement('poi-freq', poi.freq || '');
		updateElement('poi-desc', poi.desc);
	}

	// Add event listener for unit change to update the details if needed
	document.getElementById('units').addEventListener('change', function() {
		console.log('Unit changed:', document.getElementById('units').value);
		if (currentPoi) {
			updatePoiDetails(currentPoi);
		}
	});
	
	
 



    const airspaceLayers = {
        classB: L.layerGroup(),
        classC: L.layerGroup(),
        classD: L.layerGroup(),
        classQ: L.layerGroup(),
        classR: L.layerGroup()
    };

    let airspaceLabels = [];
    let measurementCircles = {
        '15m': null,
        '18m': null
    };

	function loadGeoJsonData() {
		// Load airspace GeoJSON data
		fetch('files/airspaces.geojson')
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok ' + response.statusText);
				}
				console.log('Airspace response:', response);
				return response.json();
			})
			.then(data => {
				console.log('Airspace data:', data);
				L.geoJSON(data, {
					style: feature => {
						switch (feature.properties.CLASS) {
							case 'B': return { color: '#2979B8', weight: 2, fillOpacity: 0.1 };
							case 'C': return { color: '#903B62', weight: 2, fillOpacity: 0.1 };
							case 'D': return { color: '#1D4473', weight: 2, dashArray: '5, 5', fillOpacity: 0.1 };
							case 'Q': return { color: '#903B62', weight: 2, dashArray: '10, 10', fillOpacity: 0.1 };
							case 'R': return { color: '#2979B8', weight: 2, dashArray: '10, 10', fillOpacity: 0.1 };
							default: return { color: '#2979B8', weight: 1, fillOpacity: 0.1 };
						}
					},
					onEachFeature: (feature, layer) => {
						if (feature.properties && feature.properties.NAME) {
							layer.bindPopup(`<strong>${feature.properties.NAME}</strong><br>Type: ${feature.properties.CLASS}`);
						}
						if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
							const bounds = layer.getBounds();
							const center = bounds.getCenter();

							switch (feature.properties.CLASS) {
								case 'B':
									airspaceLayers.classB.addLayer(layer);
									break;
								case 'C':
									airspaceLayers.classC.addLayer(layer);
									break;
								case 'D':
									airspaceLayers.classD.addLayer(layer);
									break;
								case 'Q':
									airspaceLayers.classQ.addLayer(layer);
									break;
								case 'R':
									airspaceLayers.classR.addLayer(layer);
									break;
								default:
									break;
							}
						}
					}
				});
			})
			.catch(error => console.error('Error loading airspace data:', error));

        // Load labels GeoJSON data
        fetch('files/labels.geojson')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                console.log('Labels response:', response);
                return response.json();
            })
            .then(data => {
                console.log('Labels data:', data);
                L.geoJSON(data, {
                    pointToLayer: (feature, latlng) => {
                        return L.marker(latlng, {
                            icon: L.divIcon({
                                className: 'label-icon',
                                html: `<div style="background: white; padding: 2px; border: 1px solid black;">${feature.properties.name}</div>`
                            })
                        });
                    }
                }).addTo(map);
            })
            .catch(error => console.error('Error loading labels data:', error));
    }

    loadGeoJsonData();

    // Airspace control with checkboxes
    const collapsibleControl = L.control({ position: 'topleft' });

    collapsibleControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'collapsible-control');
        div.innerHTML = `
            <h4><strong>Overlay</strong></h4>
            <div class="collapsible-content">
                <h4><strong>Airspaces</strong></h4>
                <label><input type="checkbox" id="classB"> Class B</label>
                <label><input type="checkbox" id="classC"> Class C</label>
                <label><input type="checkbox" id="classD"> Class D</label>
                <label><input type="checkbox" id="classQ"> DZ/MOA</label>
                <label><input type="checkbox" id="classR"> Restricted</label>
                <h4><strong>Measurement</strong></h4>
                <label><input type="checkbox" id="circle15m"> 15m</label>
                <label><input type="checkbox" id="circle18m"> 18m</label>
            </div>
        `;
        return div;
    };

    collapsibleControl.addTo(map);

    document.querySelector('.collapsible-control h4').addEventListener('click', function() {
        const content = document.querySelector('.collapsible-content');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('classB').addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(airspaceLayers.classB);
        } else {
            map.removeLayer(airspaceLayers.classB);
        }
    });

    document.getElementById('classC').addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(airspaceLayers.classC);
        } else {
            map.removeLayer(airspaceLayers.classC);
        }
    });

    document.getElementById('classD').addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(airspaceLayers.classD);
        } else {
            map.removeLayer(airspaceLayers.classD);
        }
    });

    document.getElementById('classQ').addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(airspaceLayers.classQ);
        } else {
            map.removeLayer(airspaceLayers.classQ);
        }
    });

    document.getElementById('classR').addEventListener('change', function() {
        if (this.checked) {
            map.addLayer(airspaceLayers.classR);
        } else {
            map.removeLayer(airspaceLayers.classR);
        }
    });

    function handleAirspaceLabelsVisibility(zoomLevel) {
        if (zoomLevel < 9) {
            airspaceLabels.forEach(label => map.removeLayer(label));
        } else {
            airspaceLabels.forEach(label => map.addLayer(label));
        }
    }



    document.getElementById('circle15m').addEventListener('change', function() {
        if (this.checked) {
            drawCircle('15m', 7.5);
        } else {
            removeCircle('15m');
        }
    });

    document.getElementById('circle18m').addEventListener('change', function() {
        if (this.checked) {
            drawCircle('18m', 9);
        } else {
            removeCircle('18m');
        }
    });

    function drawCircle(id, radius) {
        const center = map.getCenter();
        const circle = L.circle(center, {
            radius: radius,
            color: 'white',
            weight: 3,
            opacity: 0.7
        }).addTo(map);
        const label = L.marker(center, {
            icon: L.divIcon({
                className: 'circle-label',
                html: `<div style="font-size: 12px; color: white; text-align: center;">${id}</div>`,
                iconSize: [30, 15]
            })
        }).addTo(map);
        measurementCircles[id] = { circle, label };
    }

    function removeCircle(id) {
        if (measurementCircles[id]) {
            map.removeLayer(measurementCircles[id].circle);
            map.removeLayer(measurementCircles[id].label);
            measurementCircles[id] = null;
        }
    }

    map.on('moveend', function() {
        adjustCircles();
    });

    function adjustCircles() {
        Object.keys(measurementCircles).forEach(id => {
            const measurement = measurementCircles[id];
            if (measurement) {
                const center = map.getCenter();
                measurement.circle.setLatLng(center);
                measurement.label.setLatLng(center);
            }
        });
    }
});
