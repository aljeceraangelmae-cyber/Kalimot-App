import React, { useState, useRef, useEffect } from 'react';
import api from '../api';

const AddItem = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [mode, setMode] = useState(null); // 'camera' or 'file'

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
      setMode('camera');
    } catch (err) {
      setIsError(true);
      setMessage('❌ Camera access denied or not available.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], `item-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setImageFile(file);
      setCapturedImage(URL.createObjectURL(blob));
    }, 'image/jpeg', 0.9);

    stopCamera();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setCapturedImage(URL.createObjectURL(file));
      setMode('file');
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setImageFile(null);
    setMode(null);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleSubmit = async () => {
    if (!name || !locationNote) {
      setIsError(true);
      setMessage('Item name and location are required.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('location_note', locationNote);
    if (imageFile) formData.append('image', imageFile);

    try {
      await api.post('/api/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsError(false);
      setMessage('✅ Item recorded successfully!');
      setName('');
      setDescription('');
      setLocationNote('');
      setCapturedImage(null);
      setImageFile(null);
      setMode(null);
    } catch (err) {
      setIsError(true);
      setMessage('❌ Error saving item. Make sure Laravel is running at localhost:8000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-7">
      <h2 className="mb-4">📸 Record an Item</h2>

      {message && (
        <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="mb-4 text-center border rounded p-3" style={{ background: '#f8f9fa' }}>

        {/* Choice buttons — shown only when nothing selected yet */}
        {!cameraActive && !capturedImage && (
          <div>
            <p className="text-muted">Add a photo of the item</p>
            <button className="btn btn-outline-primary me-2" onClick={startCamera}>
              📷 Use Camera
            </button>
            <label className="btn btn-outline-secondary mb-0">
              🖼️ Upload File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        )}

        {/* Live camera view */}
        {cameraActive && (
          <div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}
            />
            <div className="mt-2">
              <button className="btn btn-success me-2" onClick={captureFrame}>
                📸 Capture Photo
              </button>
              <button className="btn btn-secondary" onClick={stopCamera}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Preview after capture or file select */}
        {capturedImage && (
          <div>
            <img
              src={capturedImage}
              alt="Item preview"
              style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}
            />
            <div className="mt-2">
              <button className="btn btn-outline-secondary" onClick={retakePhoto}>
                🔄 Choose a different photo
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Item Name <span className="text-danger">*</span></label>
        <input
          className="form-control"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. keys, comb, wallet, glasses"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Location Note <span className="text-danger">*</span></label>
        <input
          className="form-control"
          value={locationNote}
          onChange={e => setLocationNote(e.target.value)}
          placeholder="e.g. beside the bed, kitchen table, near the door"
        />
      </div>

      <div className="mb-4">
        <label className="form-label fw-bold">Description <span className="text-muted">(optional)</span></label>
        <input
          className="form-control"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Any extra notes..."
        />
      </div>

      <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Saving...' : 'Save Item'}
      </button>
    </div>
  );
};

export default AddItem;