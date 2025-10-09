import { useState, useRef } from "react";
import { Upload, X, Image, Loader2 } from "lucide-react";

interface ImageUploadProps {
	label: string;
	value?: string;
	onChange: (url: string) => void;
	placeholder?: string;
	accept?: string;
	className?: string;
}

export default function ImageUpload({
	label,
	value,
	onChange,
	placeholder = "Upload an image or enter URL",
	accept = "image/*",
	className = "",
}: ImageUploadProps) {
	const [uploading, setUploading] = useState(false);
	const [dragActive, setDragActive] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Compression removed - sending original file directly to Bunny.net

	const handleFileUpload = async (file: File) => {
		if (!file.type.startsWith("image/")) {
			alert("Please select an image file (JPG, PNG, GIF, WebP)");
			return;
		}

		setUploading(true);
		try {
			// Check file size (5MB limit for Bunny.net)
			if (file.size > 5 * 1024 * 1024) {
				alert("Image is too large. Please use a smaller image file (max 5MB).");
				return;
			}

			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/upload/image", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				onChange(data.url);
			} else {
				// Get detailed error message from server
				let errorMessage = "Upload failed";
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorData.message || errorMessage;
				} catch (e) {
					errorMessage = `Upload failed (${response.status})`;
				}
				throw new Error(errorMessage);
			}
		} catch (error) {
			console.error("Upload error:", error);
			const message =
				error instanceof Error
					? error.message
					: "Failed to upload image. Please try again.";
			alert(message);
		} finally {
			setUploading(false);
		}
	};

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			handleFileUpload(file);
		}
	};

	const handleDrop = (event: React.DragEvent) => {
		event.preventDefault();
		setDragActive(false);

		const file = event.dataTransfer.files?.[0];
		if (file) {
			handleFileUpload(file);
		}
	};

	const handleDragOver = (event: React.DragEvent) => {
		event.preventDefault();
		setDragActive(true);
	};

	const handleDragLeave = (event: React.DragEvent) => {
		event.preventDefault();
		setDragActive(false);
	};

	const removeImage = () => {
		onChange("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className={className}>
			<label className='block text-sm font-medium text-gray-700 mb-3'>
				{label}
			</label>

			{value ? (
				<div className='space-y-3'>
					{/* Image Preview */}
					<div className='relative inline-block'>
						<img
							src={value}
							alt='Preview'
							className='w-full max-w-sm h-32 object-cover rounded-lg border border-gray-300'
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.style.display = "none";
								target.nextElementSibling?.classList.remove("hidden");
							}}
						/>
						<div className='hidden w-full max-w-sm h-32 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center'>
							<div className='text-center text-gray-500'>
								<Image className='w-8 h-8 mx-auto mb-2' />
								<p className='text-sm'>Image failed to load</p>
							</div>
						</div>
						<button
							onClick={removeImage}
							className='absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
							title='Remove image'>
							<X className='w-4 h-4' />
						</button>
					</div>

					{/* URL Input for manual entry */}
					<div>
						<input
							type='url'
							value={value}
							onChange={(e) => onChange(e.target.value)}
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
							placeholder='Or enter image URL directly'
						/>
					</div>
				</div>
			) : (
				<div className='space-y-3'>
					{/* Upload Area */}
					<div
						className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
							dragActive
								? "border-blue-500 bg-blue-50"
								: "border-gray-300 hover:border-gray-400"
						}`}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}>
						<input
							ref={fileInputRef}
							type='file'
							accept={accept}
							onChange={handleFileSelect}
							className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
							disabled={uploading}
						/>

						<div className='space-y-3'>
							{uploading ? (
								<Loader2 className='w-8 h-8 text-blue-500 mx-auto animate-spin' />
							) : (
								<div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto'>
									<Image className='w-6 h-6 text-gray-400' />
								</div>
							)}

							<div>
								<p className='text-sm font-medium text-gray-900'>
									{uploading
										? "Uploading to CDN..."
										: "Drop an image here, or click to browse"}
								</p>
								<p className='text-xs text-gray-500 mt-1'>
									PNG, JPG, GIF, WebP • Max 5MB
								</p>
							</div>

							{!uploading && (
								<button
									type='button'
									className='inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'>
									<Upload className='w-4 h-4' />
									<span>Choose File</span>
								</button>
							)}
						</div>
					</div>

					{/* URL Input Alternative */}
					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-gray-300' />
						</div>
						<div className='relative flex justify-center text-xs'>
							<span className='px-2 bg-white text-gray-500'>or enter URL</span>
						</div>
					</div>

					<input
						type='url'
						value={value || ""}
						onChange={(e) => onChange(e.target.value)}
						className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						placeholder={placeholder}
					/>
				</div>
			)}
		</div>
	);
}
