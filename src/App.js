import { useState, useEffect, useRef } from 'react';
import * as mobilenet from "@tensorflow-models/mobilenet";

function App() {
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [model, setModel] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [results, setResults] = useState([]);
    const [history, setHistory] = useState([]);

    const imageRef = useRef();
    const textInputRef = useRef();
    const fileInputRef = useRef();

    const loadModel = async () => {
        setIsModelLoading(true);
        try {
            const model = await mobilenet.load();
            setModel(model);
            setIsModelLoading(false);
        } catch (error) {
            console.log(error);
            setIsModelLoading(false);
        }
    };

    const uploadImage = (e) => {
        const { files } = e.target;
        if (files.length > 0) {
            const url = URL.createObjectURL(files[0]);
            setImageURL(url);
        } else {
            setImageURL(null);
        }
    };

    const identify = async () => {
        textInputRef.current.value = '';
        const results = await model.classify(imageRef.current);
        setResults(results);
    };

    const handleOnChange = (e) => {
        setImageURL(e.target.value);
        setResults([]);
    };

    const triggerUpload = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        loadModel();
    }, []);

    useEffect(() => {
        if (imageURL) {
            setHistory([imageURL, ...history]);
        }
    }, [imageURL]);

    if (isModelLoading) {
        return <h2>Model Loading...</h2>;
    }

    return (
        <div className="App" style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/u/1/drive-viewer/AFGJ81oCoZGdZ_6L7RDIk9QuV72YqFhTZ8a5Qf0oHxdEKUNne31_6UgCpIJnmPNaqm8SA6bocDaH8ydesrGlNhLt-lvOOXZa=w4112-h2318")`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            minHeight: '100vh'
        }}>
            <div className="App">
                <h1 className='header2'>
                    <img style={{ width: 500, height: 110 }} src="https://lh3.googleusercontent.com/fife/APg5EOb6N0K9OIbtSjzslT4FGdQ06YjoxhgXwt8Jp_EpY_M058XZgDtZHvHmQyyl3KPU3PPSbbTjKqFr6ltdEA1FG4jJFcX_Keuw_SIUbRvzRTmuNrZRmzUwipC8X_kBotCq8hZZsk4pBoalONEuvx9ofBVdEAgDF_iqdbGwSbwViWA-FEzpZgf1w-epdZxUxvlbdJ-MRPJxtgt1oK_DKt0gxYFbcP_WZ3bJQQSx9pMU83-b8q-QqSdNIhfebOuOe-QHuIa-VEz7q5rcjW_ipX0WpegI8DknNZBEPXSzWLbbpgeqTOHzm6PmHooXsT3U2SGdlnlny6cpzT3UqbpWMVcvDhX5ajwmTk-rLYetRuQUjrENEU92X1ZAU9Zdj6MKToJggMajxdvu5wGainUFEZcvzxJGD_vdPjUiW_Ob4bwVrhgFwRra-PODs9-xhMAH2xGTzI666sgxO4ZxVNLr4p1BdjU6UyttyAZ-z5ZAvcPeEfHtAi_cat2U-dIQFQcGjTo3WN7pT7SJKbi6XZhIdPnFuPetfP7oHAXzLrqGF8F29P9GCpwzYXzFnueRGcKESd_IvpJzlf3SnRh4L6eFO3JKm98H6-ZpqeDccuiOdDqvGHxw1cgmFj0rY5VbeM2TmEapIX3g32jUBIVYkD_a-LBCJmuGRkVRFnZKNNmH1GXAIfRAqRvSFiEPlSHnCuh8siOFUWnepiAPVVIIZwp_-XR6kYA1XvNGA_dqNFisjagWeRAouJ3726Q6SshAymwaEAevRBnIkChlI-x12A7OhphYZs9Yr5PtfOy586jv8HUimHhuFbUZTCkDbzLpxoTIP_ODip20RULv9tVDTWtFEgM3lNQVm9KmD3SK_SvcJUS74lDvc3DD8-qSgdoFyi_q4x32UxFsslm6chGL_nqI9xaWWCZJU3QnuFhBdQAZlGbTgpXs3rc6hSKoSGsLQi1lvXE5Al6sUJaEEjU3OyJ025ScVPN3hCc6aIQjEMdpSJnBrvNL8UGhklgi5xPziX5hRr_KapUWb4mjW69Y3pwm0IycsHmTlgGoSSXIvECKZ9Il7StDBtPCYY0i86w32F66HijuAJLiIb0nzL80KXdz5JJlHgEM55fhPibD24y0vF8U3BZqy1FkKkT8Hcj9pSU=w4112-h2318" alt="Guardian" />
                </h1>
                <h1 className='header'>Identification System</h1>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 20,
                }} className='inputHolder'>
                    <input type='file' accept='image/*' capture='camera' className='uploadInput' onChange={uploadImage} ref={fileInputRef} />
                    <button className='uploadImage' onClick={triggerUpload}>Upload Image</button>
                    <span className='or'>OR</span>
                    <input type="text" placeholder='Paste image URL' ref={textInputRef} onChange={handleOnChange} />
                </div>
                <div className="mainWrapper">
                    <div className="mainContent">
                        <div className="imageHolder">
                            {imageURL && <img src={imageURL} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef} />}
                        </div>
                        {results.length > 0 && <div className='resultsHolder'>
                            {results.map((result, index) => {
                                return (
                                    <div className='result' key={result.className}>
                                        <span className='name'>{result.className}</span>
                                        <span className='confidence'>Confidence level: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Best Guess</span>}</span>
                                    </div>
                                )
                            })}
                        </div>}
                    </div>
                    {imageURL && <button className='button' onClick={identify}>Identify Image</button>}
                </div>
                {history.length > 0 && <div className="recentPredictions">
                    <h2>Recent Images</h2>
                    <div className="recentImages">
                        {history.map((image, index) => {
                            return (
                                <div className="recentPrediction" key={`${image}${index}`}>
                                    <img src={image} alt='Recent Prediction' onClick={() => setImageURL(image)} />
                                </div>
                            )
                        })}
                    </div>
                </div>}
            </div>
        </div>
    );
}

export default App;
