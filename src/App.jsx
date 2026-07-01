import './App.css'
import { FormControl, InputGroup, Container, Button, Card, Row } from 'react-bootstrap'
import { useState } from 'react'

const apiKey = import.meta.env.VITE_CLIENT_ID; // 

function App() {
  const [searchInput, setSearchInput] = useState("")
  const [albums, setAlbums] = useState([])

  async function search() {
    if (!searchInput) {
      console.log("Search input is empty!");
      return;
    }

    console.log("Searching Last.fm for:", searchInput);

    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(searchInput)}&api_key=${apiKey}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error("Last.fm API Error:", data.message);
        setAlbums([]);
        return;
      }

      if (data.topalbums && data.topalbums.album) {
        setAlbums(data.topalbums.album);
        console.log("Albums successfully saved to state:", data.topalbums.album);
      } else {
        setAlbums([]);
      }

    } catch (error) {
      console.error("Network error fetching from Last.fm:", error);
    }
  }

  function getAlbumImage(album) {
    const imgs = album.image || [];
    const large = imgs.find(img => img.size === 'extralarge') || imgs[imgs.length - 1];
    return large && large['#text'] ? large['#text'] : 'https://placehold.co/200x200?text=No+Image';
  }

  return (
    <>
     <Container style={{ textAlign: 'center', marginTop: '50px', marginBottom: '20px' }}>
        <h1 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Album Finder</h1>
        <p style={{ color: 'gray', marginBottom: '30px' }}>
          Search any artist and browse their top albums
        </p>
      </Container>
      
      <Container style={{ marginBottom: '30px' }}>
        <InputGroup>
          <FormControl
            placeholder="Search For Artist"
            type='input'
            aria-label="Search for an Artist"
            onKeyDown={event => {
              if (event.key === "Enter") {
                search()
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
            style={{
              width: '300px',
              height: '35px',
              borderWidth: '0px',
              borderStyle: 'solid',
              borderRadius: '5px',
              marginRight: '10px',
              paddingLeft: '10px'
            }}
          />

          <Button onClick={search}>
            Search
          </Button>

        </InputGroup>
      </Container>

      <Container>
        <Row style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignContent: 'center',
        }}>
          {albums.map((album, index) => {
            return (
              <Card key={album.mbid || `${album.name}-${index}`} style={{
                backgroundColor: 'white',
                margin: '10px',
                borderRadius: '5px',
                marginBottom: '30px',
              }} >

                <Card.Img
                  width={200}
                  src={getAlbumImage(album)}
                  style={{ borderRadius: '4%' }}
                />

                <Card.Body>
                  <Card.Title style={{
                    whiteSpace: 'wrap',
                    fontWeight: 'bold',
                    maxWidth: '200px',
                    fontSize: '18px',
                    marginTop: '10px',
                    color: 'black'
                  }}>{album.name}</Card.Title>

                  <Card.Text style={{ color: 'black' }}>
                    Playcount: <br /> {album.playcount}
                  </Card.Text>

                  <Button href={album.url} target="_blank" rel="noreferrer" style={{
                    backgroundColor: 'black',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    borderRadius: '5px',
                    padding: '10px',
                  }}>Album Link
                  </Button>
                </Card.Body>
              </Card>
            )
          })}
        </Row>
      </Container>
    </>
  )
}

export default App