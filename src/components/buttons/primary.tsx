export default function PrimaryButton(text: string) {
    return (
        <button
            type="submit"
            className="w-full h-11 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
        >
            {text}
        </button>
    )
}