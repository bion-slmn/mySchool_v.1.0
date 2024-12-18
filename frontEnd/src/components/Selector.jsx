import { useState, useEffect } from "react";
import { fetchData } from "../service/apiservice";
import { useAuth } from "../service/authService";
import { toast } from "react-toastify";

export const Selector = ({ onSelect, endPoint, label }) => {
    const { checkTokenAndRefresh } = useAuth();
    const [entities, setEntities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchDataAsync = async () => {
            setIsLoading(true);
            try {
                await checkTokenAndRefresh();
                const entityData = await fetchData(endPoint);
                setEntities(entityData);
            } catch (err) {
                toast.error(err.message || "Failed to fetch. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDataAsync();
    }, [endPoint, checkTokenAndRefresh]);

    const handleSelect = (e) => {
        const selectedId = e.target.value;
        console.log("Selected ID:", selectedId);
        if (selectedId && onSelect) {
            onSelect(selectedId);
        }

    };

    return (
        <div className="container">
            <label htmlFor="selector" className="form-label">
                Select a {label}
            </label>
            {isLoading ? (
                <div className="d-flex justify-content-center">Loading...</div>
            ) : (
                <select
                    id="selector"
                    onChange={handleSelect}
                    className="form-select"
                    defaultValue="" // Ensure no option is selected initially
                >
                    <option value="" disabled>
                        Select {label}
                    </option>
                    {entities.length > 0 ? (
                        entities.map((entity) => (
                            <option key={entity.id} value={entity.id}>
                                {entity.name}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>
                            No {label} found
                        </option>
                    )}
                </select>
            )}
        </div>
    );
};
