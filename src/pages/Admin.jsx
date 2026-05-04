import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import Header from "../components/Header";
import { LogOut, Upload, Link as LinkIcon, Trash2, Package, Image as ImageIcon, X, Plus } from "lucide-react";

export default function Admin() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    
    // Auth State
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    // Banner State
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerUrl, setBannerUrl] = useState("");
    const [uploadingBanner, setUploadingBanner] = useState(false);

    // Product State
    const [productName, setProductName] = useState("");
    const [productFiles, setProductFiles] = useState([]);
    const [uploadingProduct, setUploadingProduct] = useState(false);
    const [updatingProductId, setUpdatingProductId] = useState(null);

    // ☁️ CONFIGURAÇÃO CLOUDINARY
    const CLOUD_NAME = "dy7eri5xh";
    const UPLOAD_PRESET = "obtupfsm";

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Listen for banners
        const qBanners = query(collection(db, "banners"), orderBy("createdAt", "desc"));
        const unsubscribeBanners = onSnapshot(qBanners, (snapshot) => {
            setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Listen for products
        const qProducts = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeAuth();
            unsubscribeBanners();
            unsubscribeProducts();
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

    // --- BANNER FUNCTIONS ---
    async function uploadBanner() {
        if (!bannerFile) return alert("Selecione uma imagem");
        setUploadingBanner(true);
        try {
            const url = await uploadToCloudinary(bannerFile);
            await addDoc(collection(db, "banners"), { url, createdAt: new Date() });
            alert("Banner adicionado!");
            setBannerFile(null);
        } catch (err) {
            alert("Erro no upload: " + err.message);
        } finally {
            setUploadingBanner(false);
        }
    }

    async function salvarBannerViaLink() {
        if (!bannerUrl) return;
        try {
            await addDoc(collection(db, "banners"), { url: bannerUrl, createdAt: new Date() });
            alert("Salvo com sucesso!");
            setBannerUrl("");
        } catch (err) {
            alert("Erro ao salvar link");
        }
    }

    // --- PRODUCT FUNCTIONS ---
    async function handleAddProduct(e) {
        e.preventDefault();
        if (!productName || productFiles.length === 0) return alert("Preencha o nome e selecione ao menos uma imagem.");
        
        setUploadingProduct(true);
        try {
            const imageUrls = [];
            for (const file of productFiles) {
                const url = await uploadToCloudinary(file);
                imageUrls.push(url);
            }

            await addDoc(collection(db, "products"), {
                name: productName,
                images: imageUrls,
                createdAt: new Date()
            });

            alert("Produto cadastrado com sucesso!");
            setProductName("");
            setProductFiles([]);
        } catch (err) {
            alert("Erro ao cadastrar produto: " + err.message);
        } finally {
            setUploadingProduct(false);
        }
    }

    async function adicionarFotoProduto(productId, file) {
        if (!file) return;
        setUpdatingProductId(productId);
        try {
            const url = await uploadToCloudinary(file);
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, {
                images: arrayUnion(url)
            });
            alert("Foto adicionada com sucesso!");
        } catch (err) {
            alert("Erro ao adicionar foto: " + err.message);
        } finally {
            setUpdatingProductId(null);
        }
    }

    async function excluirFotoProduto(productId, imageUrl) {
        if (window.confirm("Deseja remover esta foto do produto?")) {
            try {
                const productRef = doc(db, "products", productId);
                await updateDoc(productRef, {
                    images: arrayRemove(imageUrl)
                });
                alert("Foto removida!");
            } catch (err) {
                alert("Erro ao remover foto");
            }
        }
    }

    // Helper for Cloudinary
    async function uploadToCloudinary(file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error?.message || "Erro no Cloudinary");
        }

        const data = await res.json();
        return data.secure_url;
    }

    async function excluirDocumento(colecao, id) {
        if (window.confirm("Tem certeza que deseja excluir tudo?")) {
            try {
                await deleteDoc(doc(db, colecao, id));
                alert("Excluído com sucesso!");
            } catch (err) {
                alert("Erro ao excluir");
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
                                <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Senha</label>
                                <input type="password" placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} required />
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
                        <p style={{ color: '#666' }}>Gerencie banners e produtos</p>
                    </div>
                    <button onClick={handleLogout} className="btn" style={{ backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LogOut size={18} /> Sair
                    </button>
                </div>

                {/* PRODUTOS SECTION */}
                <div className="section" style={{ padding: '0 0 60px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                        <Package size={28} color="#c59d5f" />
                        <h2>Gerenciar Produtos</h2>
                    </div>
                    
                    <div className="card" style={{ padding: '30px', marginBottom: '40px' }}>
                        <h3>Novo Produto</h3>
                        <form onSubmit={handleAddProduct} style={{ marginTop: '20px' }}>
                            <div className="input-group">
                                <label>Nome do Produto</label>
                                <input 
                                    placeholder="Ex: Estojo com Zíper" 
                                    value={productName}
                                    onChange={e => setProductName(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label>Fotos do Produto (Selecione uma ou mais)</label>
                                <input 
                                    type="file" 
                                    multiple 
                                    onChange={e => setProductFiles(Array.from(e.target.files))}
                                />
                            </div>
                            
                            {productFiles.length > 0 && (
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                    {productFiles.map((f, i) => (
                                        <img 
                                            key={i}
                                            src={URL.createObjectURL(f)} 
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
                                            alt="Preview"
                                        />
                                    ))}
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary btn-full" disabled={uploadingProduct}>
                                {uploadingProduct ? "Cadastrando..." : "Cadastrar Produto"}
                            </button>
                        </form>
                    </div>

                    <h3>Produtos Atuais</h3>
                    <div className="grid">
                        {products.map(p => (
                            <div key={p.id} className="card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <h4 style={{ color: '#4a3728' }}>{p.name}</h4>
                                    <button 
                                        onClick={() => excluirDocumento("products", p.id)}
                                        title="Excluir produto inteiro"
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '15px' }}>
                                    {p.images.map((img, idx) => (
                                        <div key={idx} style={{ position: 'relative', height: '80px' }}>
                                            <img 
                                                src={img} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} 
                                                alt="Galeria" 
                                            />
                                            <button 
                                                onClick={() => excluirFotoProduto(p.id, img)}
                                                style={{ 
                                                    position: 'absolute', 
                                                    top: '-5px', 
                                                    right: '-5px', 
                                                    backgroundColor: '#ef4444', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    borderRadius: '50%', 
                                                    width: '20px', 
                                                    height: '20px', 
                                                    fontSize: '12px', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                                }}
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    {/* Botão de Adicionar Foto */}
                                    <label style={{ 
                                        height: '80px', 
                                        border: '2px dashed #c59d5f', 
                                        borderRadius: '6px', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        cursor: 'pointer',
                                        color: '#c59d5f',
                                        fontSize: '10px',
                                        opacity: updatingProductId === p.id ? 0.5 : 1
                                    }}>
                                        <input 
                                            type="file" 
                                            hidden 
                                            disabled={updatingProductId === p.id}
                                            onChange={e => adicionarFotoProduto(p.id, e.target.files[0])} 
                                        />
                                        <Plus size={20} />
                                        <span>{updatingProductId === p.id ? "Subindo..." : "Add Foto"}</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '60px' }} />

                {/* BANNERS SECTION */}
                <div className="section" style={{ padding: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                        <ImageIcon size={28} color="#c59d5f" />
                        <h2>Gerenciar Banners</h2>
                    </div>

                    <div className="grid">
                        <div className="card" style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <Upload size={24} color="#c59d5f" />
                                <h3>Upload de Banner</h3>
                            </div>
                            <input type="file" onChange={e => setBannerFile(e.target.files[0])} style={{ marginBottom: '20px' }} />
                            {bannerFile && <img src={URL.createObjectURL(bannerFile)} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} alt="Preview" />}
                            <button onClick={uploadBanner} className="btn btn-primary btn-full" disabled={uploadingBanner}>
                                {uploadingBanner ? "Enviando..." : "Enviar Imagem"}
                            </button>
                        </div>

                        <div className="card" style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <LinkIcon size={24} color="#c59d5f" />
                                <h3>Adicionar por Link</h3>
                            </div>
                            <input placeholder="https://exemplo.com/imagem.jpg" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} style={{ marginBottom: '20px' }} />
                            <button onClick={salvarBannerViaLink} className="btn btn-primary btn-full" disabled={!bannerUrl}>Salvar Link</button>
                        </div>
                    </div>

                    <div className="mt-4" style={{ marginTop: '40px' }}>
                        <h3>Banners Atuais</h3>
                        <div className="grid">
                            {banners.map(b => (
                                <div key={b.id} className="card" style={{ position: 'relative' }}>
                                    <img src={b.url} style={{ width: '100%', height: '150px', objectFit: 'cover' }} alt="Banner" />
                                    <button onClick={() => excluirDocumento("banners", b.id)} style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', color: '#ef4444', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}