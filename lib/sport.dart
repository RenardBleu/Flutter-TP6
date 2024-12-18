import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class SportsPage extends StatefulWidget {
  const SportsPage({super.key, required this.title});
  final String title;

  @override
  State<SportsPage> createState() => _SportsPageState();
}

class _SportsPageState extends State<SportsPage> {
  TextEditingController _nationController = TextEditingController();
  List<Sport> _sports = [];
  final bool enabled = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('${widget.title} - Les sports'),
        backgroundColor: Colors.red,
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              TextField(
                controller: _nationController,
                decoration: InputDecoration(labelText: 'Recherche d\'une sport'),
                onSubmitted: (value) {
                  _searchSport(value);
                },
              ),
              SizedBox(height: 16.0),
              Expanded(
              child: ListView.builder(
                itemCount: _sports.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text(_sports[index].nom!),
                  );
                },
              ),
            ),
            ],
          ),
        ),
    );
  }
//---- DEF FONCTION----//

  Future<void> _searchSport(String query) async {
    final url = Uri.parse('http://10.0.2.2:3000/sport');
    
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      setState(() {
        _sports = data.map((sport) => Sport.fromJson(sport)).toList();
      });
    } else {
      print('Erreur : ${response.statusCode}');
    }
  }
}

class Sport {
  String? nom;

  Sport({required this.nom});

  factory Sport.fromJson(Map<String, dynamic> json) {
    return Sport(
      nom: json['nom'],
    );
  }
}