import React from "react";

function CommonForm({
    formControls = [],
    formData = {},
    setFormData,
    onSubmit,
    buttonText,
    isBtnDisabled,
}) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = {
            ...formData,
            [name]: value,
        };
        setFormData(updatedForm);

        // Log every change to console
        console.log(`Field: ${name}, Value: ${value}`);
        console.log("Updated form data:", updatedForm);
    };


    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    const renderInputsByComponentType = (control) => {
        const value = formData[control.name] || "";

        switch (control.componentType) {
            case "input":
                return (
                    <input
                        type={control.type || "text"}
                        name={control.name}
                        id={control.name}
                        placeholder={control.placeholder}
                        value={value}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                );

            case "select":
                return (
                    <select
                        name={control.name}
                        id={control.name}
                        value={value}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                        <option value="">{control.placeholder || "Select an option"}</option>
                        {control.options?.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case "textarea":
                return (
                    <textarea
                        name={control.name}
                        id={control.name}
                        placeholder={control.placeholder}
                        value={value}
                        onChange={handleChange}
                        rows="4"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                );

            default:
                return null;
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full  space-y-4 bg-white p-4 rounded-lg shadow"
        >
            {formControls.map((control) => (
                <div key={control.name} className="flex flex-col">
                    <label
                        htmlFor={control.name}
                        className="mb-1 text-sm font-medium text-gray-700"
                    >
                        {control.label}
                    </label>
                    {renderInputsByComponentType(control)}
                </div>
            ))}

            <button
                type="submit"
                disabled={isBtnDisabled}
                className={`w-full py-2 mt-4 rounded-lg text-white font-semibold transition cursor-pointer ${isBtnDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600"
                    }`}
            >
                {buttonText || "Submit"}
            </button>
        </form>
    );
}

export default CommonForm;


