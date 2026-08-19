import { useState, useRef } from 'react'
import { BackButton, Divider, DocumentPlaceholder } from '../components/shared'
import { CameraIcon, UploadIcon, RobotIcon } from '../icons'
export interface UploadedFile {
  name: string
  previewUrl: string
  type: string
}

interface TakeUploadScreenProps {
  onBack: () => void
  uploadedFile: UploadedFile | null
  onSetFile: (file: UploadedFile | null) => void
  isAnalyzing: boolean
  onAnalyze: () => void
  uploadMode: 'report' | 'profile'
}

export default function TakeUploadScreen({
  onBack,
  uploadedFile,
  onSetFile,
  isAnalyzing,
  onAnalyze,
  uploadMode,
}: TakeUploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileError, setFileError] = useState('')
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileSelect(file: File) {
    const isSupported = file.type.startsWith('image/') || file.type === 'application/pdf'
    if (!isSupported) {
      setFileError('Choose a JPEG, PNG, or PDF file.')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setFileError('Choose a file smaller than 20MB.')
      return
    }
    setFileError('')
    if (uploadedFile) URL.revokeObjectURL(uploadedFile.previewUrl)
    onSetFile({ name: file.name, previewUrl: URL.createObjectURL(file), type: file.type })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const hasFile = !!uploadedFile
  const isPdf = uploadedFile?.type === 'application/pdf'

  function clearSelection() {
    if (uploadedFile) URL.revokeObjectURL(uploadedFile.previewUrl)
    onSetFile(null)
    setFileError('')
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-5 pb-3 bg-paper sticky top-0 z-10">
        <BackButton onClick={onBack} />
        <h1 className="text-lg font-semibold text-ink font-heading">
          {uploadMode === 'profile' ? 'Update Profile Photo' : 'Scan Document'}
        </h1>
      </header>

      <main className="flex-1 px-5 pb-8">
        {/* Two primary action buttons */}
        <div className="space-y-3 mt-2 mb-6">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full bg-surface border border-[var(--ink-a10)] rounded-[16px] py-4 px-5 flex items-center gap-4 card-shadow hover:border-clinical-blue/40 transition-colors active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-blue"
          >
            <div className="w-11 h-11 rounded-full bg-clinical-blue/10 flex items-center justify-center flex-shrink-0">
              <CameraIcon size={22} className="text-clinical-blue" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-ink text-base">Take Image</p>
              <p className="text-sm" style={{ color: 'var(--ink-a50)' }}>Use your device camera</p>
            </div>
          </button>

          <Divider label="or" />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-surface border border-[var(--ink-a10)] rounded-[16px] py-4 px-5 flex items-center gap-4 card-shadow hover:border-clinical-blue/40 transition-colors active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-clinical-blue"
          >
            <div className="w-11 h-11 rounded-full bg-clinical-blue/10 flex items-center justify-center flex-shrink-0">
              <UploadIcon size={22} className="text-clinical-blue" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-ink text-base">Upload Image</p>
              <p className="text-sm" style={{ color: 'var(--ink-a50)' }}>Choose from your gallery or files</p>
            </div>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]) }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]) }}
        />

        {/* Preview panel */}
        <div
          className={`relative rounded-[16px] border-2 transition-colors duration-200 overflow-hidden ${isDragging ? 'border-clinical-blue bg-clinical-blue/5' : hasFile ? 'border-[var(--ink-a10)]' : 'border-dashed border-[var(--ink-a20)] bg-surface'}`}
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {hasFile ? (
            <div className="relative">
              <div className="p-4">
                {isPdf ? (
                  <div className="rounded-[8px] border border-[var(--ink-a10)] bg-paper p-6">
                    <DocumentPlaceholder />
                    <p className="mt-3 text-center text-sm font-medium text-ink break-words">{uploadedFile.name}</p>
                  </div>
                ) : (
                  <img src={uploadedFile.previewUrl} alt={uploadedFile.name} className="w-full rounded-[8px] object-contain max-h-96" />
                )}
              </div>
              {/* Retake button */}
              <button
                onClick={clearSelection}
                className="absolute top-3 right-3 bg-ink/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full hover:bg-ink/90 transition-colors"
              >
                Choose another
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <UploadIcon size={40} className="mb-3 opacity-25 text-ink" />
              <p className="text-base font-medium text-ink mb-1">
                {isDragging ? 'Drop your document here' : 'Preview will appear here'}
              </p>
              <p className="text-sm" style={{ color: 'var(--ink-a50)' }}>
                JPEG, PNG, PDF — up to 20MB
              </p>
            </div>
          )}

          {/* Analyze button — shown only when image is present */}
          {hasFile && !isAnalyzing && (
            <div className="px-4 pb-4">
              <button
                onClick={onAnalyze}
                className="w-full bg-periwinkle text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2.5 hover:opacity-90 transition-opacity active:scale-[0.98] shadow-[0_4px_16px_rgba(91,111,214,0.3)]"
              >
                <RobotIcon size={20} />
                Analyze with AI
              </button>
            </div>
          )}

          {/* Processing overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-paper/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-clinical-blue border-t-transparent animate-spin" />
              <div className="text-center">
                <p className="text-base font-semibold text-ink">Reading your document…</p>
                <p className="text-sm mt-1" style={{ color: 'var(--ink-a50)' }}>This takes about 10 seconds</p>
              </div>
            </div>
          )}
        </div>

        {fileError && <p className="mt-2 text-sm text-clarity-amber" role="alert">{fileError}</p>}

        {/* Desktop drag-and-drop hint */}
        <p className="text-center text-sm mt-3 xl:block hidden" style={{ color: 'var(--ink-a50)' }}>
          You can also drag and drop a document directly onto the preview area above
        </p>
      </main>
    </div>
  )
}
