import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class AthletesPage extends StatefulWidget {
  const AthletesPage({super.key, required this.title});
  final String title;

  @override
  State<AthletesPage> createState() => _AthletesPageState();
}

class _AthletesPageState extends State<AthletesPage> {
  final TextEditingController _nationController = TextEditingController();
  List<Athlete> _athletes = [];
  final bool enabled = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('${widget.title} - Les athletes'),
        backgroundColor: Colors.red,
        ),
        body: Center(
          
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              TextField(
                controller: _nationController,
                decoration: const InputDecoration(labelText: 'Recherche d\'une nation'),
                onSubmitted: (value) {
                  _searchNation(value);
                },
              ),
              const SizedBox(height: 16.0),
              Expanded(
              child: ListView.builder(
                itemCount: _athletes.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text('${_athletes[index].nom!} ${_athletes[index].prenom!}'),
                    subtitle: Text('${_athletes[index].continent!} | ${_athletes[index].sport!}'),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: FloatingActionButton.extended(
                onPressed: (){
                }, 
                label: const Text('Ajouter une nation'),
                icon: const Icon(Icons.add),
              ),
            )
            ],
          ),
        ),
    );
  }



//---- DEF FONCTION----//



  Future<void> _searchNation(String query) async {
    final url = Uri.parse('http://10.0.2.2:3000/athlete/$query');
    
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      setState(() {
        _athletes = data.map((nation) => Athlete.fromJson(nation)).toList();
      });
    } else {
      print('Erreur : ${response.statusCode}');
    }
  }
}



//---- DEF OBJET----//


class Athlete {
  String? nom;
  String? prenom;
  String? sport;
  String? continent;

  Athlete({required this.nom, required this.continent, required this.prenom, required this.sport});

  factory Athlete.fromJson(Map<String, dynamic> json) {
    return Athlete(
      nom: json['nom'],
      prenom: json['prenom'],
      sport: json['sport'],
      continent: json['nation'],
    );
  }
}