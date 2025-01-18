import { useState, useEffect } from "react";
import { Box, Typography, Grid, List, ListItem, CircularProgress, Card, CardContent, CardMedia } from "@mui/material";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // NewsAPI'den Türkçe ekonomi haberleri çeken kod
    fetch("https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=3784edbcb5f74e4eaedd2f6e37ac3418", {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}. ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data); // API yanıtını kontrol et

        if (data && data.articles && data.articles.length > 0) {
          setNews(data.articles); // Veriyi state'e yerleştir
        } else {
          setError("No articles available for the selected parameters.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Haberler yüklenirken bir hata oluştu: " + error.message); // Hata mesajını state'e kaydediyoruz
      })
      .finally(() => {
        setLoading(false); // Yükleme işlemi bittiğinde setLoading(false) yapılıyor
      });
  }, []);

  return (
    <Grid container spacing={2} sx={{ minHeight: "100vh", padding: 2 }}>
      <Grid item xs={10}>
        {/* Burada diğer içerik olacak */}
      </Grid>

      {/* Sağ Sidebar - sadece sağda haberler */}
      <Grid item xs={2}>
        <Box
          sx={{
            position: "fixed",   // Sağda sabit kalsın
            top: 0,
            right: 0,
            width: "20%",         // Genişlik oranını ayarlıyoruz
            height: "100vh",      // Yüksekliği ekran boyutuna göre ayarlıyoruz
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Opak beyaz zemin
            padding: 2,
            overflowY: "auto",
            marginLeft: "50px",
            borderRadius: "10px",
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: "black", // Yazı rengi siyah
            backgroundImage: `url('https://cdn.britannica.com/25/93825-050-D1300547/collection-newspapers.jpg?w=300')`, 
            backgroundSize: "cover",  // Görselin boyutunun paneli kaplaması için
            backgroundPosition: "center", // Ortalar
          }}
        >
          <Typography variant="h6" gutterBottom>Economy News</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <List sx={{ width: '100%' }}>
              {error ? (  // Hata varsa mesajı göster
                <Typography>{error}</Typography>
              ) : (
                news.length === 0 ? (
                  <Typography>No news available.</Typography>
                ) : (
                  news.map((article, index) => (
                    <ListItem key={index} sx={{ marginBottom: 2 }}>
                      <Card sx={{ display: "flex", flexDirection: "column", boxShadow: 3 }}>
                        {article.urlToImage ? (
                          <CardMedia
                            component="img"
                            height="140"
                            image={article.urlToImage}
                            alt={article.title}
                          />
                        ) : (
                          <CardMedia
                            component="img"
                            height="140"
                            image="https://source.unsplash.com/random/300x200?economy" // Ekonomik bir şey arka planı için
                            alt="default image"
                          />
                        )}
                        <CardContent>
                          <Typography variant="h6">{article.title}</Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {article.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))
                )
              )}
            </List>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
