import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
    Box, Typography, RadioGroup, Radio, FormControlLabel, 
    TextField, MenuItem, Button, Collapse, Divider, Grid, Card, CardContent,  CircularProgress,  IconButton, InputAdornment 
} from '@mui/material';

import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import ClientNavbar from '../client/ClientNavBar';
import ClientFooter from '../client/ClientFooter';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const GOOGLE_MAPS_API_KEY = "AIzaSyBNxX3ljGhriIMNevt02quEXGO6fhIqhls"; // Replace with your API key

const containerStyle = {
    width: "100%",
    height: "300px"
};

const center = { lat: 1.3521, lng: 103.8198 }; // Default center (Singapore)

const sampleOutlets = ['Outlet 1 - Main St.', 'Outlet 2 - Downtown', 'Outlet 3 - Suburb'];

function UserPayment() {
    const { state } = useLocation();
const { cartItems, totalPrice } = state || { cartItems: [], totalPrice: 0 };

const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    const [orderType, setOrderType] = useState('pickup');
    const [pickupLocation, setPickupLocation] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('asap');
    const [scheduledTime, setScheduledTime] = useState('');
    const [showCardDetails, setShowCardDetails] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(center);
    const [mapKey, setMapKey] = useState(0);
    const [hideAllCardFields, setHideAllCardFields] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

    const gstAmount = totalPrice * 0.09;
    const subtotal = totalPrice;

    let deliveryFee = 4.50;
    if (totalPrice > 30) deliveryFee = 0.00;
    else if (totalPrice > 20) deliveryFee = 1.00;
    else if (totalPrice > 15) deliveryFee = 2.00;

    const totalWithGSTAndDelivery = subtotal + gstAmount + deliveryFee

    // Form States
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        cardNumber: '',
        cardName: '',
        cvc: '',
        expiryDate: ''
    });


    // Error States
    const [errors, setErrors] = useState({});
    const [fieldVisibility, setFieldVisibility] = useState({
        cardNumber: false,
        cardName: false,
        cvc: false,
        expiryDate: false
    });

    const toggleFieldVisibility = (field) => {
        setFieldVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleClearFields = (section) => {
        if (section === "contact") {
            setFormValues(prev => ({ ...prev, firstName: '', lastName: '', phoneNumber: '', email: '' }));
        } else if (section === "card") {
            setFormValues(prev => ({ ...prev, cardNumber: '', cardName: '', cvc: '', expiryDate: '' }));
        }
    };

    const handleOrderTypeChange = (e) => {
        setOrderType(e.target.value);
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setMarkerPosition({ lat: latitude, lng: longitude });
                fetchAddressFromCoords(latitude, longitude);
            },
            () => {
                alert("Unable to retrieve location. Please allow location access.");
                setLoadingLocation(false);
            }
        );
    };

    const fetchAddressFromCoords = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.results.length > 0) {
                setDeliveryAddress(data.results[0].formatted_address);
            } else {
                alert("Could not fetch address.");
            }
        } catch (error) {
            alert("Failed to get address. Please try again.");
        }
        setLoadingLocation(false);
    };

    const handlePlaceSelect = (autocomplete) => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (!place || !place.geometry) {
                console.error("No place details available");
                return;
            }
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setMarkerPosition({ lat, lng });
            setDeliveryAddress(place.formatted_address);
        }
    };

    const onMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setMarkerPosition({ lat, lng });
        fetchAddressFromCoords(lat, lng);
    };

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!/^[A-Za-z]+$/.test(value)) error = `${name === 'firstName' ? 'First' : 'Last'} name should contain only letters.`;
                break;

            case 'phoneNumber':
                if (!/^\d{8}$/.test(value)) error = "Phone number should be exactly 8 digits.";
                break;

            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format.";
                break;

            case 'cardNumber':
                if (showCardDetails && !/^\d{16}$/.test(value)) error = "Card number should be 16 digits.";
                break;

            case 'cardName':
                if (showCardDetails && !/^[A-Za-z\s]+$/.test(value)) error = "Name on card should contain only letters.";
                break;

            case 'cvc':
                if (showCardDetails && !/^\d{3}$/.test(value)) error = "CVC should be 3 digits.";
                break;

                case 'expiryDate':
                    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
                    if (showCardDetails && !expiryDateRegex.test(value)) {
                        error = "Expiry date must be in MM/YYYY format.";
                    }
                    break;
                default:
                    break;
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleExpiryDateChange = (e) => {
        let { value } = e.target;
    
        // Remove non-numeric characters
        value = value.replace(/\D/g, ""); 
    
        // Auto-format MM/YYYY
        if (value.length > 2) {
            value = value.slice(0, 2) + "/" + value.slice(2, 6);
        }
    
        setFormValues((prevValues) => ({ ...prevValues, expiryDate: value }));
        validateField("expiryDate", value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = () => {
        const validationErrors = {};
        Object.keys(formValues).forEach((field) => validateField(field, formValues[field]));

        if (Object.values(errors).some((err) => err)) {
            alert("Please correct the errors in the form.");
        } else {
            alert("Payment successful!");
        }
    };

    return (
        <Box>
            <ClientNavbar />
            <Box sx={{ my: 4, px: 2, maxWidth: 800, mx: "auto" }}>
                <Typography variant="h5" sx={{ my: 2, fontWeight: "bold" }}>Payment Details</Typography>
                {/* Order Type Section */}
                <Typography variant="h6">Order Type</Typography>
                <RadioGroup value={orderType} onChange={handleOrderTypeChange} row>
                    <FormControlLabel value="pickup" control={<Radio />} label="Pick-Up" />
                    <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
                </RadioGroup>

                {orderType === 'pickup' && (
                    <TextField
                        select
                        fullWidth
                        label="Select Pick-Up Location"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        {sampleOutlets.map((outlet, index) => (
                            <MenuItem key={index} value={outlet}>{outlet}</MenuItem>
                        ))}
                    </TextField>
                )}

                {/* Google Maps Integration */}
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
          {orderType === "delivery" && (
            <Box key={mapKey}> {/* Force re-render with key change */}
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={markerPosition}
                zoom={15}
                onClick={onMapClick}
              >
                <Marker position={markerPosition} />
              </GoogleMap>

              <Autocomplete
    onLoad={(autocomplete) => {
        if (autocomplete) {
            autocomplete.addListener("place_changed", () => handlePlaceSelect(autocomplete));
        }
    }}
>
    <TextField 
        fullWidth 
        label="Search Address" 
        variant="outlined" 
        value={deliveryAddress} 
        onChange={(e) => setDeliveryAddress(e.target.value)} 
    />
</Autocomplete>

              <Button
                variant="outlined"
                onClick={getCurrentLocation}
                sx={{ mt: 2 }}
                disabled={loadingLocation}
              >
                {loadingLocation ? <CircularProgress size={20} /> : "Use My Current Location"}
              </Button>
            </Box>
          )}
        </LoadScript>

                {/* Pick-Up or Delivery Time */}
                <Typography variant="h6" sx={{ mt: 4 }}>Pick-Up/Delivery Time</Typography>
                <RadioGroup value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} row>
                    <FormControlLabel value="asap" control={<Radio />} label="ASAP" />
                    <FormControlLabel value="scheduled" control={<Radio />} label="Schedule for Later" />
                </RadioGroup>

                {deliveryTime === 'scheduled' && (
                    <TextField
                        fullWidth
                        type="datetime-local"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                )}

                   {/* Contact Information */}
                <Typography variant="h6" sx={{ mt: 4 }}>Your Contact Information</Typography>
                <Grid container spacing={2}>
                    {['firstName', 'lastName', 'phoneNumber', 'email'].map((field, index) => (
                        <Grid item xs={6} key={index}>
                            <TextField
                                fullWidth
                                name={field}
                                label={field.replace(/([A-Z])/g, ' $1').trim()}
                                value={formValues[field]}
                                onChange={handleChange}
                                error={!!errors[field]}
                                helperText={errors[field]}
                            />
                        </Grid>
                    ))}
                </Grid>
                <Button variant="outlined" onClick={() => handleClearFields("contact")} sx={{ mt: 2 }}>
                    Clear Contact Fields
                </Button>

                   {/* Payment Method */}
                   <Typography variant="h6" sx={{ mt: 4 }}>Payment Method</Typography>
                   <Button
    variant="contained"
    sx={{
        backgroundColor: selectedPaymentMethod === "creditCard" ? "green" : "#1976d2", 
        color: "white",
        fontSize: "1rem", 
        padding: "8px 16px",
        mt: 2,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        '&:hover': { backgroundColor: selectedPaymentMethod === "creditCard" ? "darkgreen" : "#1565c0" }
    }}
    onClick={() => {
        setSelectedPaymentMethod("creditCard");
        setShowCardDetails(!showCardDetails);
    }}
>
    <Box 
        sx={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: "2px solid white",
            backgroundColor: selectedPaymentMethod === "creditCard" ? "white" : "transparent"
        }}
    />
    Pay by Credit Card
</Button>

                <Collapse in={showCardDetails}>
                    <Box sx={{ mt: 2 }}>
                    {['cardNumber', 'cardName', 'cvc', 'expiryDate'].map((field, index) => (
    <TextField
        key={index}
        fullWidth
        name={field}
        label={field.replace(/([A-Z])/g, ' $1').trim()}
        type={hideAllCardFields || fieldVisibility[field] ? "password" : "text"}
        value={formValues[field]}
        onChange={field === "expiryDate" ? handleExpiryDateChange : handleChange} // Use specific handler
        error={!!errors[field]}
        helperText={errors[field]}
        inputProps={field === "expiryDate" ? { maxLength: 7 } : {} } // Restrict expiryDate length
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton onClick={() => toggleFieldVisibility(field)}>
                        {fieldVisibility[field] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            )
        }}
        sx={{ mb: 2 }}
                            />
                        ))}
                    </Box>
                    <Button variant="outlined" onClick={() => handleClearFields("card")} sx={{ mt: 2 }}>
                    Clear Credit Card Fields
                </Button>
                <Button variant="outlined" onClick={() => setHideAllCardFields(!hideAllCardFields)} sx={{ mt: 2 }}>
                    {hideAllCardFields ? "Show All" : "Hide All"} Card Fields
                </Button>
                </Collapse>
                

                {/* Order Summary */}
                <Typography variant="h6" sx={{ mt: 4 }}>Order Summary</Typography>
                {cartItems.map((item, index) => (
                    <Card key={index} sx={{ my: 1 }}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography>{item.productName} x {item.quantity}</Typography>
                                <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                            </Box>
                            <img
                                src={`${import.meta.env.VITE_FILE_BASE_URL}${item.imageFile}`}
                                alt={item.productName}
                                style={{ width: 50, height: 50, borderRadius: 8 }}
                            />
                        </CardContent>
                    </Card>
                ))}

<Divider sx={{ my: 2 }} />
<Typography variant="h6">Total Items: {totalItems}</Typography>
                <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
                <Typography>GST (9%): ${gstAmount.toFixed(2)}</Typography>
                <Typography>Delivery Fee: ${deliveryFee.toFixed(2)}</Typography>
                <Typography variant="h6">Total: ${totalWithGSTAndDelivery.toFixed(2)}</Typography>

                {/* Confirm and Pay Button */}
                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 3 }}
                    onClick={handleSubmit}
                >
                    Confirm & Pay
                </Button>
                <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                    By confirming and paying your order, you agree to our Terms of Use and Privacy Agreement.
                </Typography>
            </Box>
            <ClientFooter />
        </Box>
    );
}

export default UserPayment;


