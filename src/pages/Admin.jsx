import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import Header from "../components/Header";
import { LogOut, Upload, Link as LinkIcon, Trash2 } from "lucide-react";

export default function Admin() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [banners, setBanners] = useState([]);
    
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    // ☁️ CONFIGURAÇÃO CLOUDINARY
    const CLOUD_NAME = "dy7eri5xh";
    const UPLOAD_PRESET = "obtupfsm";

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Escutar banners em tempo real
        const q = query(collection(db, "banners"), orderBy("createdAt", "desc"));
        const unsubscribeBanners = onSnapshot(q, (snapshot) => {
            const lista = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBanners(lista);
        });

        return () => {
            unsubscribeAuth();
            unsubscribeBanners();
        };
    }, []);

    async function handleLogin(e) {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, senha);
        } catch (e) {
            alert("Erro ao logar: verifique suas credenciais.");
        }
    }

    async function handleLogout() {
        await signOut(auth);
    }

    async function uploadCloudinary() {
        if (!file) return alert("Selecione uma imagem");
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error?.message || "Erro desconhecido");
            }

            const data = await res.json();

            await addDoc(collection(db, "banners"), {
                url: data.secure_url,
                createdAt: new Date()
            });

            alert("Upload feito com sucesso!");
            setFile(null);
        } catch (err) {
            console.error(err);
            alert("Erro no upload: " + err.message + "\n\nVerifique se o seu Cloud Name e o Upload Preset (Unsigned) estão corretos.");
        } finally {
            setUploading(false);
        }
    }

    async function salvarViaLink() {
        if (!url) return;
        try {
            await addDoc(collection(db, "banners"), {
                url,
                createdAt: new Date()
            });
            alert("Salvo com sucesso!");
            setUrl("");
        } catch (err) {
            alert("Erro ao salvar link");
        }
    }

    async function excluirBanner(id) {
        if (window.confirm("Tem certeza que deseja excluir este banner?")) {
            try {
                await deleteDoc(doc(db, "banners", id));
                alert("Banner excluído!");
            } catch (err) {
                alert("Erro ao excluir banner");
            }
        }
    }

    if (loading) return <div className="text-center mt-4">Carregando...</div>;

    if (!user) {
        return (
            <div className="admin-page">
                <Header />
                <div className="container">
                    <div className="login-container">
                        <div className="text-center mb-4">
                            <h2>Acesso Restrito</h2>
                            <p>Entre com suas credenciais de administrador</p>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <label>E-mail</label>
                                <input
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Senha</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-full">Entrar</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <Header />
            <div className="container section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h2>Painel Administrativo</h2>
                        <p style={{ color: '#666' }}>Gerencie os banners e produtos do seu site</p>
                    </div>
                    <button onClick={handleLogout} className="btn" style={{ backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LogOut size={18} /> Sair
                    </button>
                </div>

                <div className="grid">
                    {/* CLOUDINARY */}
                    <div className="card" style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Upload size={24} color="#c59d5f" />
                            <h3>Upload de Banner</h3>
                        </div>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
                            Selecione uma imagem para enviar ao Cloudinary.
                        </p>

                        <input
                            type="file"
                            onChange={e => setFile(e.target.files[0])}
                            style={{ marginBottom: '20px', fontSize: '0.9rem' }}
                        />

                        {file && (
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>Pré-visualização:</p>
                                <img
                                    src={URL.createObjectURL(file)}
                                    style={{ width: '100%', borderRadius: '8px', height: '150px', objectFit: 'cover' }}
                                    alt="Preview"
                                />
                            </div>
                        )}

                        <button
                            onClick={uploadCloudinary}
                            className="btn btn-primary btn-full"
                            disabled={uploading || !file}
                        >
                            {uploading ? "Enviando..." : "Enviar Imagem"}
                        </button>
                    </div>

                    {/* LINK UPLOAD */}
                    <div className="card" style={{ padding: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <LinkIcon size={24} color="#c59d5f" />
                            <h3>Adicionar por Link</h3>
                        </div>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
                            Cole a URL de uma imagem hospedada externamente.
                        </p>

                        <div className="input-group">
                            <input
                                placeholder="https://exemplo.com/imagem.jpg"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                        </div>

                        {url && (
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>Pré-visualização:</p>
                                <img
                                    src={url}
                                    style={{ width: '100%', borderRadius: '8px', height: '150px', objectFit: 'cover' }}
                                    alt="Preview"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}

                        <button
                            onClick={salvarViaLink}
                            className="btn btn-primary btn-full"
                            disabled={!url}
                        >
                            Salvar Link
                        </button>
                    </div>
                </div>

                {/* LISTAGEM DE BANNERS */}
                <div className="mt-4" style={{ marginTop: '60px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Banners Atuais</h3>
                    <div className="grid">
                        {banners.length === 0 && <p style={{ color: '#666' }}>Nenhum banner cadastrado.</p>}
                        {banners.map((b) => (
                            <div key={b.id} className="card" style={{ position: 'relative' }}>
                                <img src={b.url} style={{ width: '100%', height: '150px', objectFit: 'cover' }} alt="Banner" />
                                <button 
                                    onClick={() => excluirBanner(b.id)}
                                    style={{ 
                                        position: 'absolute', 
                                        top: '10px', 
                                        right: '10px', 
                                        backgroundColor: 'white', 
                                        color: '#ef4444', 
                                        padding: '8px', 
                                        borderRadius: '50%',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}