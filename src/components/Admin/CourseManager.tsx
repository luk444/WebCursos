import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plus, Edit, Trash2, Video, Save, Image as ImageIcon, AlertCircle, GitBranch as BrandTelegram, Download } from 'lucide-react';
import { Course, Module, Lesson } from '../../types';
import { validateYouTubeUrl } from '../../utils/videoHelpers';
import { VideoPreview } from '../Courses/VideoPreview';


const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonDuration, setLessonDuration] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [videoUrlError, setVideoUrlError] = useState<string>('');
  const [telegramUrl, setTelegramUrl] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceType, setResourceType] = useState<'link' | 'file'>('link');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        modules: doc.data().modules || []
      })) as Course[];
      setCourses(coursesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const resetModuleForm = () => {
    setModuleTitle('');
    setModuleDescription('');
    setSelectedModule(null);
    setShowModuleForm(false);
  };

  const resetLessonForm = () => {
    setLessonTitle('');
    setLessonDescription('');
    setLessonVideoUrl('');
    setLessonDuration(0);
    setSelectedLesson(null);
    setShowLessonForm(false);
  };

  const resetForm = () => {
    setCourseTitle('');
    setCourseDescription('');
    setPreviewImageUrl('');
    setSelectedCourse(null);
    resetModuleForm();
    resetLessonForm();
  };

  const handleVideoUrlChange = (url: string) => {
    setLessonVideoUrl(url);
    if (url && !validateYouTubeUrl(url)) {
      setVideoUrlError('Por favor ingrese una URL válida de YouTube');
    } else {
      setVideoUrlError('');
    }
  };

  const handleSaveCourse = async () => {
    try {
      if (!courseTitle.trim()) {
        alert('El título del curso es obligatorio');
        return;
      }

      const courseData = {
        title: courseTitle,
        description: courseDescription,
        previewImageUrl: previewImageUrl || null,
        telegramUrl: telegramUrl || null,
        modules: selectedCourse?.modules || [],
        createdAt: selectedCourse?.createdAt || new Date(),
        updatedAt: new Date()
      };

      if (selectedCourse) {
        await updateDoc(doc(db, 'courses', selectedCourse.id), courseData);
      } else {
        await addDoc(collection(db, 'courses'), courseData);
      }

      await fetchCourses();
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error al guardar el curso');
    }
  };

  const handleSaveModule = async () => {
    if (!selectedCourse) return;

    try {
      if (!moduleTitle.trim()) {
        alert('El título del módulo es obligatorio');
        return;
      }

      const updatedModules = [...(selectedCourse.modules || [])];
      
      // Calculate the new module order
      let newOrder: number;
      if (selectedModule) {
        // Keep existing order when editing
        newOrder = selectedModule.order;
      } else {
        // For new modules, use the next available number
        const maxOrder = Math.max(...updatedModules.map(m => m.order), -1);
        newOrder = maxOrder + 1;
      }

      const newModule = {
        id: selectedModule?.id || crypto.randomUUID(),
        title: `Módulo ${newOrder + 1}: ${moduleTitle}`,
        description: moduleDescription,
        order: newOrder,
        lessons: selectedModule?.lessons || []
      };

      if (selectedModule) {
        const moduleIndex = updatedModules.findIndex(m => m.id === selectedModule.id);
        if (moduleIndex !== -1) {
          updatedModules[moduleIndex] = newModule;
        }
      } else {
        updatedModules.push(newModule);
      }

      // Sort modules by order
      updatedModules.sort((a, b) => a.order - b.order);

      await updateDoc(doc(db, 'courses', selectedCourse.id), {
        modules: updatedModules
      });

      // Update the local course data
      const updatedCourse = {
        ...selectedCourse,
        modules: updatedModules
      };
      setSelectedCourse(updatedCourse);
      
      // Update courses list
      setCourses(prevCourses => 
        prevCourses.map(c => 
          c.id === selectedCourse.id ? updatedCourse : c
        )
      );

      resetModuleForm();
    } catch (error) {
      console.error('Error saving module:', error);
      alert('Error al guardar el módulo');
    }
  };

  const handleAddResource = () => {
    if (!resourceTitle.trim() || !resourceUrl.trim()) {
      alert('El título y la URL del recurso son obligatorios');
      return;
    }

    const newResource: Resource = {
      id: crypto.randomUUID(),
      title: resourceTitle,
      url: resourceUrl,
      type: resourceType
    };

    setResources([...resources, newResource]);
    setResourceTitle('');
    setResourceUrl('');
    setResourceType('link');
  };

  const handleRemoveResource = (resourceId: string) => {
    setResources(resources.filter(r => r.id !== resourceId));
  };

  const handleSaveLesson = async () => {
    if (!selectedCourse || !selectedModule) {
      alert('Por favor seleccione un módulo primero');
      return;
    }

    try {
      if (!lessonTitle.trim()) {
        alert('El título de la lección es obligatorio');
        return;
      }

      if (!lessonVideoUrl.trim()) {
        alert('La URL del video es obligatoria');
        return;
      }

      if (!validateYouTubeUrl(lessonVideoUrl)) {
        alert('Por favor ingrese una URL válida de YouTube');
        return;
      }

      const updatedModules = [...selectedCourse.modules];
      const moduleIndex = updatedModules.findIndex(m => m.id === selectedModule.id);
      
      if (moduleIndex === -1) {
        alert('Módulo no encontrado');
        return;
      }

      const updatedLessons = [...(selectedModule.lessons || [])];
      
      // Calculate lesson order
      let newOrder: number;
      if (selectedLesson) {
        newOrder = selectedLesson.order;
      } else {
        const maxOrder = Math.max(...updatedLessons.map(l => l.order), -1);
        newOrder = maxOrder + 1;
      }

      const newLesson = {
        id: selectedLesson?.id || crypto.randomUUID(),
        title: `Lección ${newOrder + 1}: ${lessonTitle}`,
        description: lessonDescription,
        videoUrl: lessonVideoUrl,
        order: newOrder,
        duration: lessonDuration,
        resources: resources
      };

      if (selectedLesson) {
        const lessonIndex = updatedLessons.findIndex(l => l.id === selectedLesson.id);
        if (lessonIndex !== -1) {
          updatedLessons[lessonIndex] = newLesson;
        }
      } else {
        updatedLessons.push(newLesson);
      }

      // Sort lessons by order
      updatedLessons.sort((a, b) => a.order - b.order);

      updatedModules[moduleIndex] = {
        ...selectedModule,
        lessons: updatedLessons
      };

      // Update in Firestore
      await updateDoc(doc(db, 'courses', selectedCourse.id), {
        modules: updatedModules
      });

      // Update local state
      const updatedCourse = {
        ...selectedCourse,
        modules: updatedModules
      };
      setSelectedCourse(updatedCourse);
      
      // Update courses list
      setCourses(prevCourses => 
        prevCourses.map(c => 
          c.id === selectedCourse.id ? updatedCourse : c
        )
      );

      resetLessonForm();
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Error al guardar la lección');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'courses', courseId));
      await fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error al eliminar el curso');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!selectedCourse || !window.confirm('¿Estás seguro de que deseas eliminar este módulo?')) {
      return;
    }

    try {
      const updatedModules = selectedCourse.modules.filter(m => m.id !== moduleId);
      await updateDoc(doc(db, 'courses', selectedCourse.id), {
        modules: updatedModules
      });
      await fetchCourses();
    } catch (error) {
      console.error('Error deleting module:', error);
      alert('Error al eliminar el módulo');
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!selectedCourse || !window.confirm('¿Estás seguro de que deseas eliminar esta lección?')) {
      return;
    }

    try {
      const updatedModules = selectedCourse.modules.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.filter(l => l.id !== lessonId)
          };
        }
        return module;
      });

      await updateDoc(doc(db, 'courses', selectedCourse.id), {
        modules: updatedModules
      });
      await fetchCourses();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Error al eliminar la lección');
    }
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setCourseTitle(course.title);
    setCourseDescription(course.description);
    setPreviewImageUrl(course.previewImageUrl || '');
  };

  const handleEditModule = (module: Module) => {
    setSelectedModule(module);
    setModuleTitle(module.title);
    setModuleDescription(module.description);
    setShowModuleForm(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setLessonTitle(lesson.title);
    setLessonDescription(lesson.description);
    setLessonVideoUrl(lesson.videoUrl);
    setLessonDuration(lesson.duration);
    setShowLessonForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div>
            <label htmlFor="telegramUrl" className="block text-sm font-medium text-gray-700">
              URL del Grupo de Telegram
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <BrandTelegram className="h-5 w-5" />
              </span>
              <input
                type="text"
                id="telegramUrl"
                value={telegramUrl}
                onChange={(e) => setTelegramUrl(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://t.me/tucomunidad"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Añade el enlace de invitación a tu grupo de Telegram para la comunidad del curso
            </p>
          </div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {selectedCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700">
              Título del Curso
            </label>
            <input
              type="text"
              id="courseTitle"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ingrese el título del curso"
            />
          </div>

          <div>
            <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="courseDescription"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ingrese la descripción del curso"
            />
          </div>

          <div>
            <label htmlFor="previewImageUrl" className="block text-sm font-medium text-gray-700">
              URL de Imagen de Vista Previa
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="previewImageUrl"
                value={previewImageUrl}
                onChange={(e) => setPreviewImageUrl(e.target.value)}
                className="flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {selectedCourse && (
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={handleSaveCourse}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {selectedCourse ? 'Actualizar Curso' : 'Crear Curso'}
            </button>
          </div>
        </div>

        {selectedCourse && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Módulos del Curso</h3>
              <button
                onClick={() => setShowModuleForm(!showModuleForm)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Módulo
              </button>
            </div>

            {showModuleForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  {selectedModule ? 'Editar Módulo' : 'Nuevo Módulo'}
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Título del Módulo</label>
                    <input
                      type="text"
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Ingrese el título del módulo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      value={moduleDescription}
                      onChange={(e) => setModuleDescription(e.target.value)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Ingrese la descripción del módulo"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={resetModuleForm}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveModule}
                      className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      {selectedModule ? 'Actualizar Módulo' : 'Guardar Módulo'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedCourse.modules.map((module) => (
              <div key={module.id} className="mb-4 border border-gray-200 rounded-lg">
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{module.title}</h4>
                    <p className="text-sm text-gray-500">{module.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditModule(module)}
                      className="p-1 text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="p-1 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-sm font-medium text-gray-700">Lecciones</h5>
                    <button
                      onClick={() => {
                        setSelectedModule(module);
                        setShowLessonForm(!showLessonForm);
                      }}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar Lección
                    </button>
                  </div>

                  {selectedModule?.id === module.id && showLessonForm && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                        

                        <div className="mt-4 border-t border-gray-200 pt-4">
                            <h6 className="text-sm font-medium text-gray-900 mb-2">Recursos de la Lección</h6>
                            
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Título</label>
                                  <input
                                    type="text"
                                    value={resourceTitle}
                                    onChange={(e) => setResourceTitle(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Nombre del recurso"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">URL</label>
                                  <input
                                    type="text"
                                    value={resourceUrl}
                                    onChange={(e) => setResourceUrl(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="https://ejemplo.com/recurso"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                  <select
                                    value={resourceType}
                                    onChange={(e) => setResourceType(e.target.value as 'link' | 'file')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                  >
                                    <option value="link">Enlace</option>
                                    <option value="file">Archivo</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div className="flex justify-end">
                                <button
                                  onClick={handleAddResource}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Agregar Recurso
                                </button>
                              </div>
                            </div>
                            
                            {resources.length > 0 && (
                              <div className="mt-4">
                                <h6 className="text-sm font-medium text-gray-700 mb-2">Recursos Agregados:</h6>
                                <ul className="space-y-2">
                                  {resources.map((resource) => (
                                    <li key={resource.id} className="flex items-center justify-between bg-white p-2 rounded-md">
                                      <div className="flex items-center">
                                        <Download className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-900">{resource.title}</span>
                                      </div>
                                      <button
                                        onClick={() => handleRemoveResource(resource.id)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                      <h6 className="text-sm font-medium text-gray-900 mb-2">
                        {selectedLesson ? 'Editar Lección' : 'Nueva Lección'}
                      </h6>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Título</label>
                          <input
                            type="text"
                            value={lessonTitle}
                            onChange={(e) => setLessonTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Ingrese el título de la lección"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Descripción</label>
                          <textarea
                            value={lessonDescription}
                            onChange={(e) => setLessonDescription(e.target.value)}
                            rows={2}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Ingrese la descripción de la lección"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">URL del Video (YouTube)</label>
                          <input
                            type="text"
                            value={lessonVideoUrl}
                            onChange={(e) => handleVideoUrlChange(e.target.value)}
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                              videoUrlError ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                          {videoUrlError && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {videoUrlError}
                            </p>
                          )}
                          {lessonVideoUrl && !videoUrlError && (
                            <div className="mt-2">
                              <VideoPreview url={lessonVideoUrl} />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Duración (minutos)</label>
                          <input
                            type="number"
                            value={lessonDuration}
                            onChange={(e) => setLessonDuration(Number(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            min="0"
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={resetLessonForm}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSaveLesson}
                            disabled={!!videoUrlError}
                            className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {selectedLesson ? 'Actualizar Lección' : 'Guardar Lección'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {module.lessons?.length > 0 ? (
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center">
                            <Video className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                              <p className="text-xs text-gray-500">{lesson.duration} minutos</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditLesson(lesson)}
                              className="p-1 text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(module.id, lesson.id)}
                              className="p-1 text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">
                      No hay lecciones en este módulo
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Cursos Existentes</h3>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cursos</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo curso.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Módulos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {course.previewImageUrl ? (
                          <img
                            src={course.previewImageUrl}
                            alt={course.title}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://source.unsplash.com/random/800x600?education,${course.id}`;
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-indigo-600" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{course.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.modules?.length || 0} módulos
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManager;