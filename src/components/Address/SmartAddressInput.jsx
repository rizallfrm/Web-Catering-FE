import React, { useState, useEffect, useRef } from 'react';

const SmartAddressInput = ({ 
  onDeliveryFeeChange, 
  onAddressChange,
  onValidationChange, // Callback untuk validasi
  initialAddress = '',
  initialFee = 0 
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [manualDistance, setManualDistance] = useState('');
  const [useManualDistance, setUseManualDistance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [showAreaList, setShowAreaList] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isOutOfRange, setIsOutOfRange] = useState(false);
  
  const debounceRef = useRef();
  const suggestionsRef = useRef();

  // Enhanced fallback delivery areas dengan coverage realistis
  const fallbackAreas = [
    {
      tier: 'gratis',
      fee: 0,
      area_name: 'Susukan (Area Toko)',
      description: 'Area sekitar toko - GRATIS ONGKIR! 🎉',
      distance_estimate: '0-3 km',
      example_areas: ['susukan', 'karangjati', 'rejasa', 'parakancanggah', 'pakuran', 'banjarsari susukan'],
      total_areas: 8
    },
    {
      tier: 'tier1',
      fee: 3000,
      area_name: 'Kecamatan Terdekat',
      description: 'Banjarnegara Kota & Kalibening - Rp 3.000',
      distance_estimate: '3-8 km',
      example_areas: ['banjarnegara', 'kalibening', 'alun-alun banjarnegara', 'pasar banjarnegara', 'terminal banjarnegara'],
      total_areas: 7
    },
    {
      tier: 'tier2',
      fee: 5000,
      area_name: 'Kecamatan Sekitar',
      description: 'Sigaluh, Wanayasa, Pandanarum, Pejawaran, Batur, Pagentan - Rp 5.000',
      distance_estimate: '8-15 km',
      example_areas: ['sigaluh', 'wanayasa', 'pandanarum', 'pejawaran', 'batur', 'pagentan'],
      total_areas: 6
    },
    {
      tier: 'tier3',
      fee: 8000,
      area_name: 'Ujung Kabupaten',
      description: 'Karangkobar, Dieng, Banjarmangu, Punggelan, Rakit - Rp 8.000',
      distance_estimate: '15-25 km',
      example_areas: ['karangkobar', 'dieng', 'banjarmangu', 'pagedongan', 'punggelan', 'rakit', 'klampok', 'mandiraja'],
      total_areas: 9
    },
    {
      tier: 'tier4',
      fee: 12000,
      area_name: 'Kabupaten Tetangga Dekat',
      description: 'Purbalingga & Wonosobo - Rp 12.000',
      distance_estimate: '25-40 km',
      example_areas: ['purbalingga', 'wonosobo', 'bojongsari', 'kemangkon', 'garung', 'selomerto'],
      total_areas: 12
    },
    {
      tier: 'tier5',
      fee: 18000,
      area_name: 'Kabupaten Sedang',
      description: 'Banyumas & Kebumen (bagian utara) - Rp 18.000',
      distance_estimate: '40-60 km',
      example_areas: ['banyumas', 'kebumen', 'rawalo', 'alian', 'pejagoan', 'sruweng'],
      total_areas: 8
    },
    {
      tier: 'tier6',
      fee: 25000,
      area_name: 'Purwokerto',
      description: 'Purwokerto & sekitarnya - Rp 25.000',
      distance_estimate: '60-80 km',
      example_areas: ['purwokerto', 'sokaraja', 'baturaden', 'kalibagor', 'somagede'],
      total_areas: 8
    }
  ];

  // Areas yang berada di luar jangkauan layanan
  const outOfRangeAreas = [
    // Kota besar di Jawa
    'jakarta', 'bandung', 'surabaya', 'medan', 'makassar', 'palembang',
    'semarang', 'yogyakarta', 'yogya', 'jogja', 'solo', 'surakarta',
    'malang', 'kediri', 'blitar', 'madiun', 'ponorogo', 'tulungagung',
    
    // Jawa Tengah yang jauh
    'salatiga', 'klaten', 'boyolali', 'karanganyar', 'sragen', 'grobogan',
    'demak', 'kudus', 'jepara', 'pati', 'rembang', 'blora', 'cepu',
    
    // Jawa Barat
    'cirebon', 'indramayu', 'kuningan', 'majalengka', 'sumedang', 'garut',
    'tasikmalaya', 'ciamis', 'pangandaran', 'sukabumi', 'cianjur', 'bogor',
    'bekasi', 'depok', 'tangerang', 'serang', 'cilegon',
    
    // Pantai utara Jawa Tengah
    'tegal', 'pemalang', 'pekalongan', 'batang', 'kendal', 'brebes',
    
    // Jawa Timur bagian barat yang jauh
    'pacitan', 'ponorogo', 'trenggalek', 'ngawi', 'magetan',
    
    // Pantai selatan yang jauh  
    'cilacap', 'pangandaran', 'wonogiri', 'pacitan',
  ];

  // Initialize dengan initial values
  useEffect(() => {
    if (initialAddress && initialFee > 0) {
      setAddress(initialAddress);
      setDeliveryInfo({
        fee: initialFee,
        description: 'Biaya pengiriman terdeteksi',
        confidence: 'medium',
        method: 'initialized'
      });
    }
  }, [initialAddress, initialFee]);

  // Load delivery areas saat component mount
  useEffect(() => {
    loadDeliveryAreas();
  }, []);

  // Auto-calculate saat address berubah
  useEffect(() => {
    if (address.length > 3 && !useManualDistance) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        calculateDeliveryFee();
      }, 500);
    } else if (!address || address.length <= 3) {
      setDeliveryInfo(null);
      setIsOutOfRange(false);
      onDeliveryFeeChange(0, null);
      if (onValidationChange) onValidationChange(true); // Valid ketika kosong
    }
    
    return () => clearTimeout(debounceRef.current);
  }, [address, useManualDistance]);

  // Update validation status
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(!isOutOfRange);
    }
  }, [isOutOfRange, onValidationChange]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadDeliveryAreas = async () => {
    try {
      const testResponse = await fetch('/api/test-delivery');
      console.log('Test endpoint response:', testResponse.status);
      
      const response = await fetch('/api/delivery/areas');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setDeliveryAreas(result.data.areas);
        setApiError(null);
        console.log('Successfully loaded delivery areas:', result.data.areas.length);
      } else {
        throw new Error(result.message || 'Failed to load areas');
      }
    } catch (error) {
      console.error('Error loading delivery areas:', error);
      setApiError(error.message);
      setDeliveryAreas(fallbackAreas);
      console.log('Using fallback delivery areas');
    }
  };

  // Enhanced local calculation with comprehensive out of range detection
  const calculateDeliveryFeeLocal = (inputAddress) => {
    const address = inputAddress.toLowerCase().trim();
    
    // 1. Check if out of range first (prioritas tertinggi)
    const isOutOfRangeArea = outOfRangeAreas.some(area => {
      // Exact match
      if (address.includes(area)) return true;
      
      // Partial word match for cities
      const addressWords = address.split(/\s+/);
      return addressWords.some(word => word === area || (word.length > 3 && area.includes(word)));
    });
    
    if (isOutOfRangeArea) {
      setIsOutOfRange(true);
      return {
        fee: 0,
        area_name: 'Di Luar Jangkauan Layanan',
        description: 'Maaf, area ini berada di luar jangkauan layanan kami. Layanan terbatas untuk Jawa Tengah Selatan.',
        confidence: 'high',
        method: 'out_of_range_detection',
        tier: 'out_of_range',
        is_out_of_range: true,
        blocked: true
      };
    }
    
    setIsOutOfRange(false);
    
    // 2. Check against service areas (exact match)
    for (const area of fallbackAreas) {
      for (const example of area.example_areas) {
        if (address.includes(example)) {
          return {
            fee: area.fee,
            area_name: area.area_name,
            description: area.description,
            confidence: 'medium',
            method: 'local_fallback',
            tier: area.tier,
            matched_keyword: example,
            distance_estimate: area.distance_estimate,
            is_out_of_range: false
          };
        }
      }
    }
    
    // 3. Partial word matching for better detection
    const addressWords = address.split(/[\s,.-]+/).filter(word => word.length > 2);
    
    for (const area of fallbackAreas) {
      for (const example of area.example_areas) {
        const exampleWords = example.split(/[\s,.-]+/);
        
        const hasMatch = exampleWords.some(exampleWord => 
          addressWords.some(addressWord => {
            return (
              addressWord.includes(exampleWord) || 
              exampleWord.includes(addressWord)
            ) && exampleWord.length >= 3;
          })
        );
        
        if (hasMatch) {
          return {
            fee: area.fee,
            area_name: area.area_name,
            description: area.description,
            confidence: 'low',
            method: 'local_fallback_partial',
            tier: area.tier,
            matched_keyword: example,
            distance_estimate: area.distance_estimate,
            is_out_of_range: false
          };
        }
      }
    }
    
    // 4. Default for unknown areas (assume within range but unknown)
    setIsOutOfRange(false);
    return {
      fee: 30000,
      area_name: 'Area Tidak Dikenal',
      description: 'Area belum terdaftar dalam sistem - Rp 30.000 (akan dikonfirmasi admin)',
      confidence: 'low',
      method: 'local_fallback_default',
      tier: 'unknown',
      requires_confirmation: true,
      is_out_of_range: false
    };
  };

  // Enhanced manual distance calculation
  const calculateManualDistance = (distance) => {
    const km = parseFloat(distance);
    
    if (isNaN(km) || km < 0) {
      setIsOutOfRange(false);
      return {
        fee: 0,
        area_name: 'Input Tidak Valid',
        description: 'Jarak harus berupa angka positif',
        confidence: 'none',
        method: 'manual_invalid',
        is_out_of_range: false
      };
    }

    // Check if distance is out of range (>80km)
    if (km > 80) {
      setIsOutOfRange(true);
      return {
        fee: 0,
        area_name: 'Jarak Terlalu Jauh',
        description: `Jarak ${km} km melebihi jangkauan maksimal layanan (80 km dari toko)`,
        confidence: 'high',
        method: 'manual_distance_out_of_range',
        distance: km,
        is_out_of_range: true,
        blocked: true
      };
    }

    setIsOutOfRange(false);

    // Calculate fee based on realistic distance ranges
    const result = {
      confidence: 'high',
      method: 'manual_distance',
      distance: km,
      is_out_of_range: false
    };

    if (km <= 3) {
      return { 
        ...result, 
        fee: 0, 
        area_name: 'Area Toko', 
        description: `GRATIS ONGKIR! - Jarak: ${km} km`, 
        tier: 'gratis' 
      };
    }
    if (km <= 8) {
      return { 
        ...result, 
        fee: 3000, 
        area_name: 'Kecamatan Terdekat', 
        description: `Rp 3.000 - Jarak: ${km} km`, 
        tier: 'tier1' 
      };
    }
    if (km <= 15) {
      return { 
        ...result, 
        fee: 5000, 
        area_name: 'Kecamatan Sekitar', 
        description: `Rp 5.000 - Jarak: ${km} km`, 
        tier: 'tier2' 
      };
    }
    if (km <= 25) {
      return { 
        ...result, 
        fee: 8000, 
        area_name: 'Ujung Kabupaten', 
        description: `Rp 8.000 - Jarak: ${km} km`, 
        tier: 'tier3' 
      };
    }
    if (km <= 40) {
      return { 
        ...result, 
        fee: 12000, 
        area_name: 'Kabupaten Tetangga', 
        description: `Rp 12.000 - Jarak: ${km} km`, 
        tier: 'tier4' 
      };
    }
    if (km <= 60) {
      return { 
        ...result, 
        fee: 18000, 
        area_name: 'Kabupaten Sedang', 
        description: `Rp 18.000 - Jarak: ${km} km`, 
        tier: 'tier5' 
      };
    }
    if (km <= 80) {
      return { 
        ...result, 
        fee: 25000, 
        area_name: 'Purwokerto', 
        description: `Rp 25.000 - Jarak: ${km} km`, 
        tier: 'tier6' 
      };
    }

    // This shouldn't happen due to check above, but just in case
    return {
      ...result,
      fee: 30000,
      area_name: 'Area Jauh',
      description: `Rp 30.000 - Jarak: ${km} km (akan dikonfirmasi admin)`,
      requires_confirmation: true
    };
  };

  // Enhanced delivery fee calculation
  const calculateDeliveryFee = async () => {
    try {
      setIsLoading(true);
      
      let result;
      
      if (useManualDistance) {
        result = calculateManualDistance(manualDistance);
      } else {
        // Try API call first, fallback to local
        try {
          const response = await fetch('/api/delivery/calculate-fee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
          });

          if (response.ok) {
            const apiResult = await response.json();
            if (apiResult.status === 'success') {
              result = apiResult.data;
              setApiError(null);
              
              // Update out of range status from API
              setIsOutOfRange(result.is_out_of_range || result.blocked || false);
            } else {
              throw new Error('API calculation failed');
            }
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (error) {
          console.error('API error, using local calculation:', error);
          setApiError(error.message);
          result = calculateDeliveryFeeLocal(address);
        }
      }
      
      setDeliveryInfo(result);
      onDeliveryFeeChange(result.fee, result);
      
    } catch (error) {
      console.error('Error calculating delivery fee:', error);
      setApiError(error.message);
      
      if (!useManualDistance && address) {
        const localResult = calculateDeliveryFeeLocal(address);
        setDeliveryInfo(localResult);
        onDeliveryFeeChange(localResult.fee, localResult);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced address change handler with better suggestions
  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setAddress(value);
    onAddressChange(value);

    if (value.length > 2 && !useManualDistance) {
      try {
        const response = await fetch(`/api/delivery/suggest?query=${encodeURIComponent(value)}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success' && result.data.suggestions.length > 0) {
            setSuggestions(result.data.suggestions);
            setShowSuggestions(true);
            return;
          }
        }
      } catch (error) {
        console.error('Error getting suggestions:', error);
      }
      
      // Enhanced fallback suggestions
      const localSuggestions = [];
      const searchTerm = value.toLowerCase();
      
      // Check for out of range areas first
      const matchedOutOfRange = outOfRangeAreas.filter(area => 
        area.includes(searchTerm) || searchTerm.includes(area)
      );
      
      matchedOutOfRange.forEach(area => {
        localSuggestions.push({
          area: area,
          fee: 0,
          tier: 'out_of_range',
          area_name: 'Di Luar Jangkauan',
          description: 'Area di luar jangkauan layanan',
          is_out_of_range: true
        });
      });
      
      // Add normal area suggestions
      fallbackAreas.forEach(area => {
        area.example_areas.forEach(example => {
          if (example.includes(searchTerm) && 
              !localSuggestions.some(s => s.area === example)) {
            localSuggestions.push({
              area: example,
              fee: area.fee,
              tier: area.tier,
              area_name: area.area_name,
              description: area.description,
              is_out_of_range: false
            });
          }
        });
      });
      
      // Sort suggestions: available areas first, then out of range
      localSuggestions.sort((a, b) => {
        if (a.is_out_of_range !== b.is_out_of_range) {
          return a.is_out_of_range ? 1 : -1;
        }
        return a.fee - b.fee;
      });
      
      if (localSuggestions.length > 0) {
        setSuggestions(localSuggestions.slice(0, 8)); // Max 8 suggestions
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  // Enhanced suggestion selection
  const selectSuggestion = (suggestion) => {
    setAddress(suggestion.area);
    setShowSuggestions(false);
    
    if (suggestion.is_out_of_range) {
      setIsOutOfRange(true);
      setDeliveryInfo({
        fee: 0,
        description: 'Area di luar jangkauan layanan kami',
        tier: 'out_of_range',
        confidence: 'high',
        method: 'suggestion_out_of_range',
        area_name: 'Di Luar Jangkauan Layanan',
        is_out_of_range: true,
        blocked: true
      });
      onDeliveryFeeChange(0, suggestion);
    } else {
      setIsOutOfRange(false);
      setDeliveryInfo({
        fee: suggestion.fee,
        description: suggestion.description,
        tier: suggestion.tier,
        confidence: 'high',
        method: 'suggestion_selected',
        area_name: suggestion.area_name,
        is_out_of_range: false
      });
      onDeliveryFeeChange(suggestion.fee, suggestion);
    }
    
    onAddressChange(suggestion.area);
  };

  const handleManualDistanceChange = (e) => {
    const value = e.target.value;
    setManualDistance(value);
    
    if (value && !isNaN(parseFloat(value))) {
      setAddress('');
      onAddressChange('');
      
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        calculateDeliveryFee();
      }, 500);
    } else {
      setDeliveryInfo(null);
      setIsOutOfRange(false);
      onDeliveryFeeChange(0, null);
    }
  };

  const handleManualDistanceToggle = (checked) => {
    setUseManualDistance(checked);
    if (!checked) {
      setManualDistance('');
      setIsOutOfRange(false);
      if (address.length > 3) {
        calculateDeliveryFee();
      }
    } else {
      setDeliveryInfo(null);
      setIsOutOfRange(false);
      onDeliveryFeeChange(0, null);
    }
  };

  const selectFromAreaList = (area) => {
    if (useManualDistance) {
      const avgDistance = {
        'gratis': 1.5,
        'tier1': 5.5,
        'tier2': 11.5,
        'tier3': 20,
        'tier4': 30,
        'tier5': 50,
        'tier6': 70
      };
      setManualDistance(avgDistance[area.tier]?.toString() || '');
    } else {
      const exampleArea = area.example_areas[0] || area.area_name.toLowerCase();
      setAddress(exampleArea);
      onAddressChange(exampleArea);
    }
    
    setIsOutOfRange(false);
    setDeliveryInfo({
      fee: area.fee,
      description: area.description,
      tier: area.tier,
      confidence: 'high',
      method: 'area_list_selected',
      area_name: area.area_name,
      is_out_of_range: false
    });
    onDeliveryFeeChange(area.fee, area);
    setShowAreaList(false);
  };

  const getConfidenceColor = (confidence) => {
    if (isOutOfRange) return 'border-red-500 bg-red-50';
    
    switch (confidence) {
      case 'high': return 'border-green-200 bg-green-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-orange-200 bg-orange-50';
      default: return 'border-red-200 bg-red-50';
    }
  };

  const getConfidenceIcon = (confidence) => {
    if (isOutOfRange) return '🚫';
    
    switch (confidence) {
      case 'high': return '✅';
      case 'medium': return '⚠️';
      case 'low': return '🔍';
      default: return '❌';
    }
  };

  return (
    <div className="space-y-4">
      {/* API Error Warning */}
      {/* {apiError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500">⚠️</span>
            <div>
              <p className="text-sm font-medium text-yellow-800">Mode Offline</p>
              <p className="text-xs text-yellow-700">
                Menggunakan perhitungan lokal. API Error: {apiError}
              </p>
            </div>
          </div>
        </div>
      )} */}

      {/* Out of Range Alert */}
      {isOutOfRange && (
        <div className="bg-red-50 border border-red-500 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <span className="text-red-500 text-2xl">🚫</span>
            <div>
              <p className="font-medium text-red-800">Area Di Luar Jangkauan Layanan</p>
              <p className="text-sm text-red-700 mt-1">
                Maaf, saat ini kami belum melayani pengiriman ke area tersebut. 
                Layanan kami terbatas untuk wilayah Jawa Tengah Selatan (Banjarnegara dan sekitarnya).
              </p>
              <div className="mt-2 p-2 bg-red-100 rounded">
                <p className="text-xs text-red-600 font-medium">
                  💡 Coba area lain seperti: Sigaluh, Purbalingga, Wonosobo, Purwokerto
                </p>
              </div>
              <p className="text-xs text-red-600 mt-2 font-medium">
                ⚠️ Pesanan tidak dapat diproses untuk area ini
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Manual Distance & Area List */}
      <div className="flex items-center justify-between">
        {/* <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useManualDistance"
            checked={useManualDistance}
            onChange={(e) => handleManualDistanceToggle(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="useManualDistance" className="text-sm text-gray-600">
            Input jarak manual (km)
          </label>
        </div> */}
        
        <button
          type="button"
          onClick={() => setShowAreaList(!showAreaList)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Lihat Daftar Area
        </button>
      </div>

      {useManualDistance ? (
        // Manual Distance Input
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jarak dari Toko (KM) *
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="80"
            value={manualDistance}
            onChange={handleManualDistanceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contoh: 5.5 (maksimal 80 km)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Masukkan jarak dalam kilometer dari Ds. Karangjati, Susukan (maksimal 80 km)
          </p>
        </div>
      ) : (
        // Smart Address Input
        <div className="relative" ref={suggestionsRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alamat Pengiriman *
          </label>
          <textarea
            value={address}
            onChange={handleAddressChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              isOutOfRange ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            rows="3"
            placeholder="Ketik alamat atau nama daerah (contoh: Sigaluh, RT02/05, Rumah Pak Budi)"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className={`px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors ${
                    suggestion.is_out_of_range ? 'bg-red-50 hover:bg-red-100' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`font-medium ${suggestion.is_out_of_range ? 'text-red-800' : 'text-gray-800'}`}>
                        {suggestion.is_out_of_range && '🚫 '}{suggestion.area}
                      </div>
                      <div className={`text-sm ${suggestion.is_out_of_range ? 'text-red-600' : 'text-gray-600'}`}>
                        {suggestion.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${suggestion.is_out_of_range ? 'text-red-600' : 'text-blue-600'}`}>
                        {suggestion.is_out_of_range ? 'TIDAK TERSEDIA' : 
                         suggestion.fee === 0 ? 'GRATIS' : `Rp${suggestion.fee.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Menghitung ongkir...</span>
        </div>
      )}

      {/* Delivery Info Display */}
      {deliveryInfo && !isLoading && (
        <div className={`p-4 rounded-md border ${getConfidenceColor(deliveryInfo.confidence)}`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{getConfidenceIcon(deliveryInfo.confidence)}</span>
                <h4 className={`font-semibold ${isOutOfRange ? 'text-red-800' : 'text-gray-800'}`}>
                  {deliveryInfo.area_name || 'Area Terdeteksi'}
                </h4>
              </div>
              
              <p className={`text-sm mb-1 ${isOutOfRange ? 'text-red-700' : 'text-gray-700'}`}>
                {deliveryInfo.description}
              </p>
              
              {deliveryInfo.matched_keyword && (
                <p className="text-xs text-gray-600">
                  Kata kunci: "{deliveryInfo.matched_keyword}"
                </p>
              )}
              
              {deliveryInfo.distance && (
                <p className="text-xs text-gray-600">
                  Jarak: {deliveryInfo.distance} km
                </p>
              )}
              
              {deliveryInfo.distance_estimate && !isOutOfRange && (
                <p className="text-xs text-gray-600">
                  Estimasi jarak: {deliveryInfo.distance_estimate}
                </p>
              )}
              
              {deliveryInfo.requires_confirmation && !isOutOfRange && (
                <p className="text-xs text-orange-700 mt-1 font-medium">
                  ⚠️ Akan dikonfirmasi admin sebelum pengiriman
                </p>
              )}
            </div>
            
            <div className="text-right ml-4">
              <div className={`text-2xl font-bold ${isOutOfRange ? 'text-red-600' : 'text-gray-800'}`}>
                {isOutOfRange ? 'TIDAK TERSEDIA' :
                 deliveryInfo.fee === 0 ? (
                  <span className="text-green-600">GRATIS</span>
                ) : (
                  `Rp${deliveryInfo.fee.toLocaleString()}`
                )}
              </div>
              <div className="text-xs text-gray-500">
                {deliveryInfo.method?.replace(/_/g, ' ') || 'auto-detect'}
              </div>
            </div>
          </div>
          
          {/* Confidence Indicator - Hidden for out of range */}
          {!isOutOfRange && (
            <div className="mt-3 flex items-center space-x-2">
              <span className="text-xs text-gray-500">Akurasi deteksi:</span>
              <div className="flex space-x-1">
                {['high', 'medium', 'low', 'none'].map((level, index) => (
                  <div
                    key={level}
                    className={`w-2 h-2 rounded-full ${
                      ['high', 'medium', 'low', 'none'].indexOf(deliveryInfo.confidence) >= index
                        ? 'bg-blue-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs capitalize text-gray-600">
                {deliveryInfo.confidence}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Delivery Areas List */}
      {showAreaList && (
        <div className="border border-gray-200 rounded-md max-h-96 overflow-y-auto">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 sticky top-0">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-800">Daftar Area & Tarif Pengiriman</h4>
              <button
                onClick={() => setShowAreaList(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Dari: Ds. Karangjati, Kec. Susukan, Banjarnegara
              {apiError && <span className="text-orange-600 ml-2">(Mode Offline)</span>}
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {deliveryAreas.map((area, index) => (
              <div
                key={index}
                onClick={() => selectFromAreaList(area)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">
                      {area.area_name}
                    </span>
                    {area.fee === 0 && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        GRATIS
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">
                      {area.fee === 0 ? 'GRATIS' : `Rp${area.fee.toLocaleString()}`}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {area.description}
                </p>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Jarak: {area.distance_estimate}</span>
                  <span>{area.total_areas} area</span>
                </div>
                
                {area.example_areas && area.example_areas.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Contoh area:</p>
                    <div className="flex flex-wrap gap-1">
                      {area.example_areas.slice(0, 3).map((example, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {example}
                        </span>
                      ))}
                      {area.example_areas.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{area.example_areas.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Out of Range Info */}
            <div className="px-4 py-3 bg-red-50 border-t border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-red-500">🚫</span>
                <span className="font-medium text-red-800">Area Di Luar Jangkauan</span>
              </div>
              <p className="text-sm text-red-700 mb-2">
                Area yang TIDAK dilayani (pesanan otomatis ditolak):
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {outOfRangeAreas.slice(0, 12).map((area, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                  >
                    {area}
                  </span>
                ))}
                <span className="text-xs text-red-600 font-medium">
                  +{outOfRangeAreas.length - 12} area lainnya
                </span>
              </div>
              <p className="text-xs text-red-600">
                Termasuk semua kota besar di luar Jawa Tengah Selatan
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-sm text-gray-600 space-y-1">
        <p className="font-medium">💡 Tips penggunaan:</p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>Ketik nama daerah (contoh: "Sigaluh", "Wonosobo") untuk deteksi otomatis</li>
          <li>Gunakan mode manual jika tahu jarak pasti dari toko (maksimal 80 km)</li>
          <li>Klik "Lihat Daftar Area" untuk melihat semua tarif dan area yang dilayani</li>
          <li>Area tidak terdaftar akan dikonfirmasi admin (dalam jangkauan layanan)</li>
          {/* <li className="text-red-600 font-medium">🚫 Area di luar Jawa Tengah Selatan tidak dapat diproses</li>
          {apiError && <li className="text-orange-600">🔧 Sistem berjalan dalam mode offline</li>} */}
        </ul>
      </div>

      {/* Coverage Area Info */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-start space-x-2">
          <span className="text-blue-500 mt-0.5">📍</span>
          <div>
            <p className="text-sm font-medium text-blue-800">Jangkauan Layanan:</p>
            <p className="text-sm text-blue-700">
              Pusat: Ds. Karangjati RT 01/RW 03, Kec. Susukan, Kab. Banjarnegara
            </p>
            <p className="text-sm text-blue-700">
              Radius: Maksimal 80 km dari toko (Jawa Tengah Selatan)
            </p>
            <div className="mt-2">
              <p className="text-xs text-blue-600 font-medium">Area utama yang dilayani:</p>
              <p className="text-xs text-blue-600">
                ✅ Banjarnegara, Purbalingga, Wonosobo, Kebumen (utara), Banyumas (utara), Purwokerto
              </p>
              <p className="text-xs text-red-600 mt-1">
                ❌ Jakarta, Bandung, Semarang, Yogyakarta, Solo, Surabaya, dan kota besar lainnya
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Quick Area Selector */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <p className="text-sm font-medium text-gray-700 mb-2">🚀 Pilih Cepat Area Pengiriman:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Sigaluh', fee: 5000 },
            { name: 'Purbalingga', fee: 12000 },
            { name: 'Wonosobo', fee: 12000 },
            { name: 'Purwokerto', fee: 25000 },
            { name: 'Banjarnegara', fee: 3000 },
            { name: 'Karangkobar', fee: 8000 }
          ].map((quickArea, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setAddress(quickArea.name.toLowerCase());
                onAddressChange(quickArea.name.toLowerCase());
                setIsOutOfRange(false);
                
                const areaInfo = {
                  fee: quickArea.fee,
                  area_name: quickArea.name,
                  description: `${quickArea.name} - Rp ${quickArea.fee.toLocaleString()}`,
                  confidence: 'high',
                  method: 'quick_select',
                  is_out_of_range: false
                };
                
                setDeliveryInfo(areaInfo);
                onDeliveryFeeChange(quickArea.fee, areaInfo);
              }}
              className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              {quickArea.name}
              <span className="ml-1 text-blue-600 font-medium">
                {quickArea.fee === 0 ? 'GRATIS' : `Rp${quickArea.fee.toLocaleString()}`}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartAddressInput;